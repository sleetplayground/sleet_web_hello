import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';

const initializeWalletSelector = async () => {
  const selector = await setupWalletSelector({
    network: 'testnet',
    wallets: [setupMeteorWallet()]
  });

  const loginButton = document.getElementById('near_login_button');
  loginButton.addEventListener('click', async () => {
    const accounts = await selector.wallet().signIn();
    console.log('Logged in with accounts:', accounts);
  });
};

initializeWalletSelector();