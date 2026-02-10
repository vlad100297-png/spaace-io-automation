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

  // Import wallet using seed phrase
  await metamask.importWallet(SEED_PHRASE);

  // Add Sepolia network if RPC URL is provided
  if (RPC_URL && RPC_URL !== 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY') {
    await metamask.addNetwork({
      name: NETWORK_NAME,
      rpcUrl: RPC_URL,
      chainId: CHAIN_ID,
      symbol: 'ETH'
    });
  }
});
