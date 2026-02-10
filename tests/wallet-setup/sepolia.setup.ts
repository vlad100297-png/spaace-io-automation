import { defineWalletSetup } from '@synthetixio/synpress';
import { MetaMask } from '@synthetixio/synpress/playwright';

// Load wallet credentials from environment variables
const SEED_PHRASE = process.env.METAMASK_SECRET_RECOVERY_PHRASE;
const PASSWORD = process.env.METAMASK_PASSWORD;
const NETWORK_NAME = process.env.NETWORK_NAME || 'sepolia';
const CHAIN_ID = Number(process.env.CHAIN_ID) || 11155111;
const RPC_URL = process.env.SEPOLIA_RPC_URL;

/**
 * Wallet setup for Sepolia testnet
 * This configures MetaMask with:
 * - Test wallet imported from seed phrase
 * - Sepolia network configured (if RPC URL is provided)
 */
export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD);

  // Step 1: Wait for welcome screen and click "Import wallet" button
  console.log('Waiting for MetaMask welcome screen...');
  const importButton = walletPage.getByTestId('onboarding-import-wallet');
  await importButton.waitFor({ state: 'visible', timeout: 30000 });
  await importButton.click();
  console.log('Clicked import wallet button');

  // Step 2: Agree to terms (if present)
  await walletPage.waitForTimeout(1000);
  const agreeButton = walletPage.getByTestId('metametrics-i-agree');
  if (await agreeButton.isVisible({ timeout: 5000 })) {
    await agreeButton.click();
    console.log('Agreed to terms');
  }

  // Step 3: Enter seed phrase
  console.log('Entering seed phrase...');
  const seedPhraseWords = SEED_PHRASE.split(' ');
  for (let i = 0; i < seedPhraseWords.length; i++) {
    const input = walletPage.getByTestId(`import-srp__srp-word-${i}`);
    await input.fill(seedPhraseWords[i]);
  }

  // Click confirm SRP button
  const confirmSrpButton = walletPage.getByTestId('import-srp-confirm');
  await confirmSrpButton.click();
  console.log('Confirmed seed phrase');

  // Step 4: Enter password
  await walletPage.waitForTimeout(1000);
  console.log('Entering password...');
  const passwordInput = walletPage.getByTestId('create-password-new');
  const passwordConfirmInput = walletPage.getByTestId('create-password-confirm');
  const termsCheckbox = walletPage.getByTestId('create-password-terms');

  await passwordInput.fill(PASSWORD);
  await passwordConfirmInput.fill(PASSWORD);
  await termsCheckbox.check();

  const createPasswordButton = walletPage.getByTestId('create-password-import');
  await createPasswordButton.click();
  console.log('Password set');

  // Step 5: Complete onboarding
  await walletPage.waitForTimeout(2000);
  const doneButton = walletPage.getByTestId('onboarding-complete-done');
  if (await doneButton.isVisible({ timeout: 10000 })) {
    await doneButton.click();
    console.log('Onboarding completed');
  }

  // Step 6: Dismiss any popups
  await walletPage.waitForTimeout(1000);
  const gotItButton = walletPage.getByTestId('popover-close');
  if (await gotItButton.isVisible({ timeout: 5000 })) {
    await gotItButton.click();
    console.log('Dismissed popup');
  }

  // Step 7: Wait for MetaMask home screen
  console.log('Waiting for MetaMask home screen...');
  const NETWORK_SELECTOR = '[data-testid="network-display"]';
  try {
    await walletPage.waitForSelector(NETWORK_SELECTOR, { timeout: 30000 });
    console.log('MetaMask home screen loaded');
  } catch (err) {
    console.log('Retrying home screen load...');
    const popoverClose = walletPage.locator('.popover-close');
    if (await popoverClose.isVisible({ timeout: 2000 }).catch(() => false)) {
      await popoverClose.click();
    }
    await walletPage.reload();
    await walletPage.waitForSelector(NETWORK_SELECTOR, { timeout: 20000 });
  }

  // Step 8: Add Sepolia network if RPC URL is provided
  if (RPC_URL && RPC_URL !== 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY') {
    console.log('Adding Sepolia network...');
    await metamask.addNetwork({
      name: NETWORK_NAME,
      rpcUrl: RPC_URL,
      chainId: CHAIN_ID,
      symbol: 'ETH'
    });
    console.log('Sepolia network added');
  }

  console.log('✅ MetaMask setup complete!');
});
