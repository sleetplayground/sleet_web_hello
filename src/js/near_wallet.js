import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";

// Initialize the wallet selector
let selector;
let modal;
let accountId;

// Initialize wallet selector
async function initWalletSelector() {
  try {
    selector = await setupWalletSelector({
      network: "testnet",
      modules: [setupMyNearWallet(), setupMeteorWallet()],
    });

    modal = setupModal(selector, {
      contractId: "hello.sleet.near",
    });

    // Get existing accountId if already signed in
    const wallet = await selector.wallet();
    accountId = (await wallet.getAccounts())[0]?.accountId;
    updateLoginButton();
  } catch (err) {
    console.error('Failed to initialize wallet selector:', err);
  }
}

// Update login button text based on connection status
function updateLoginButton() {
  const loginButton = document.getElementById('near_login_button');
  if (!loginButton) return;
  
  loginButton.textContent = accountId ? 'DISCONNECT' : 'LOGIN';
}

// Handle login/logout
async function handleWalletConnection() {
  if (accountId) {
    // User is signed in, so sign out
    const wallet = await selector.wallet();
    await wallet.signOut();
    accountId = null;
  } else {
    // User needs to sign in
    modal.show();
  }
  updateLoginButton();
}

// Initialize wallet selector when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initWalletSelector();

  // Add click handler to login button
  const loginButton = document.getElementById('near_login_button');
  if (loginButton) {
    loginButton.addEventListener('click', handleWalletConnection);
  }
});

// Export wallet selector instance for other modules
export { selector, accountId };