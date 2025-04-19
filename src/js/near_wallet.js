import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { getCurrentNetworkId } from './config';
import "@near-wallet-selector/modal-ui/styles.css"

let selector;
let modal;
let accountId;
const METEOR_WALLET_ID = "meteor-wallet";

// Initialize wallet selector
async function initWalletSelector() {
  try {
    const networkId = getCurrentNetworkId();
    if (!networkId) {
      throw new Error('Network ID not found');
    }

    selector = await setupWalletSelector({
      network: networkId,
      modules: [setupMeteorWallet()],
      defaultWalletId: METEOR_WALLET_ID
    });

    modal = setupModal(selector, {
      onComplete: async () => {
        try {
          const wallet = await selector.wallet();
          const accounts = await wallet.getAccounts();
          accountId = accounts[0]?.accountId;
          if (accountId) {
            updateLoginButton();
            updateNetworkToggleState();
            modal.hide();
          }
        } catch (err) {
          console.error('Error during wallet connection:', err);
          updateLoginButton();
        }
      },
      onHide: () => {
        updateLoginButton();
      }
    });

    // Get existing accountId if already signed in
    const wallet = await selector.wallet();
    accountId = (await wallet.getAccounts())[0]?.accountId;
    updateLoginButton();

    // Subscribe to changes
    selector.on("accountsChanged", (e) => {
      accountId = e.accounts[0]?.accountId;
      updateLoginButton();
    });

    selector.on("signedIn", updateLoginButton);
    selector.on("signedOut", updateLoginButton);

    // Disable network toggle when logged in
    updateNetworkToggleState();
  } catch (err) {
    console.error('Failed to initialize wallet selector:', err);
    // Ensure the login button is in the correct state even if initialization fails
    updateLoginButton();
  }
}

// Update login button text based on connection status
function updateLoginButton() {
  const loginButton = document.getElementById('near_login_button');
  if (!loginButton) return;
  loginButton.textContent = accountId ? `${accountId}` : 'LOGIN';
}

// Update network toggle button state
function updateNetworkToggleState() {
  const networkToggleButton = document.getElementById('network_toggle_button');
  if (networkToggleButton) {
    networkToggleButton.disabled = !!accountId;
  }
}

// Handle login/logout
async function handleWalletConnection() {
  if (accountId) {
    // User is signed in, so sign out
    const wallet = await selector.wallet();
    await wallet.signOut();
    accountId = null;
    updateNetworkToggleState();
    updateLoginButton();
  } else {
    // User needs to sign in - don't update button until after successful login
    modal.show();
  }
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