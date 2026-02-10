import { testWithSynpress } from '@synthetixio/synpress';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright';
import sepoliaSetup from '../wallet-setup/sepolia.setup.js';

// Create base test with MetaMask fixtures using Sepolia setup
const baseTest = testWithSynpress(metaMaskFixtures(sepoliaSetup));

/**
 * Extended test fixture with MetaMask instance and wallet address
 */
export const test = baseTest.extend<{
  metamask: MetaMask;
  walletAddress: string;
}>({
  // Auto-initialize MetaMask for each test
  metamask: async ({ context, metamaskPage, extensionId }, use) => {
    const metamask = new MetaMask(
      context,
      metamaskPage,
      sepoliaSetup.walletPassword,
      extensionId
    );
    await use(metamask);
  },

  // Provide wallet address as a fixture
  walletAddress: async ({}, use) => {
    await use(process.env.WALLET_ADDRESS || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  },
});

export const { expect } = test;
