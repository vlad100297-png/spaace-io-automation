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

  console.log('🔐 Starting MetaMask wallet import...');
  console.log('📝 Using seed phrase:', SEED_PHRASE ? 'Loaded from .env' : 'MISSING!');
  console.log('🔑 Using password:', PASSWORD ? 'Set' : 'MISSING!');

  // Use Synpress's built-in importWallet method
  // This handles all the UI variations automatically
  try {
    await metamask.importWallet(SEED_PHRASE);
    console.log('✅ Wallet imported successfully!');
  } catch (error) {
    console.error('❌ Failed to import wallet:', error);
    throw error;
  }

  // Give MetaMask a moment to settle
  console.log('Waiting for MetaMask to complete setup...');
  await walletPage.waitForTimeout(3000);

  // Try to dismiss any completion popups/tutorials
  const possibleButtons = [
    '[data-testid="popover-close"]',
    '[data-testid="onboarding-complete-done"]',
    'button:has-text("Done")',
    'button:has-text("Got it")',
    'button:has-text("Next")',
    '.popover-close'
  ];

  for (const selector of possibleButtons) {
    const button = walletPage.locator(selector);
    if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
      await button.click();
      console.log(`✅ Clicked ${selector}`);
      await walletPage.waitForTimeout(1000);
    }
  }

  console.log('✅ MetaMask ready for use')

  // Add Sepolia network if RPC URL is provided
  if (RPC_URL && RPC_URL !== 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY') {
    console.log('Adding custom network...');
    try {
      await metamask.addNetwork({
        name: NETWORK_NAME,
        rpcUrl: RPC_URL,
        chainId: CHAIN_ID,
        symbol: 'ETH'
      });
      console.log(`✅ Network "${NETWORK_NAME}" added`);
    } catch (error) {
      console.warn('⚠️  Could not add network (may already exist):', error.message);
    }
  }

  console.log('✅ MetaMask setup complete!');
});
