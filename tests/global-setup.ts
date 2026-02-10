import path from 'node:path'
import { pathToFileURL } from 'node:url'
import fs from 'fs-extra'
import { chromium, type BrowserContext, type Page } from '@playwright/test'
import sepoliaSetup from './wallet-setup/sepolia.setup'

const SYNPRESS_CACHE_MODULE_PATH = pathToFileURL(
  path.resolve(
    process.cwd(),
    'node_modules',
    '@synthetixio',
    'synpress',
    'node_modules',
    '@synthetixio',
    'synpress-cache',
    'dist',
    'index.js'
  )
).href

type SynpressCacheModule = {
  CACHE_DIR_NAME: string
  prepareExtension: () => Promise<string>
}

async function waitForExtensionPage(context: BrowserContext): Promise<Page> {
  const timeoutMs = 20000
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    const page = context.pages().find((p) => p.url().startsWith('chrome-extension://'))
    if (page) {
      await page.waitForLoadState('domcontentloaded')
      await page.waitForSelector('#app-content .app', { timeout: 15000 })
      return page
    }

    await context.waitForEvent('page', { timeout: 1000 }).catch(() => undefined)
  }

  throw new Error('MetaMask extension page did not appear in time while building cache.')
}

async function ensureWalletCache(): Promise<void> {
  const synpressCache = (await import(SYNPRESS_CACHE_MODULE_PATH)) as SynpressCacheModule
  const cacheDirPath = path.join(process.cwd(), synpressCache.CACHE_DIR_NAME, sepoliaSetup.hash)

  if (await fs.pathExists(cacheDirPath)) {
    return
  }

  await fs.ensureDir(cacheDirPath)

  const extensionPath = await synpressCache.prepareExtension()
  const browserArgs = [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]

  if (process.env.HEADLESS) {
    browserArgs.push('--headless=new')
  }

  const context = await chromium.launchPersistentContext(cacheDirPath, {
    headless: false,
    args: browserArgs
  })

  try {
    const extensionPage = await waitForExtensionPage(context)
    await sepoliaSetup.fn(context, extensionPage)
  } finally {
    await context.close()
  }
}

export default async function globalSetup(): Promise<void> {
  await ensureWalletCache()
}
