import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { getCurrentNetworkId } from './config';
import "@near-wallet-selector/modal-ui/styles.css"

// Initialize the wallet selector
let selector;
let modal;
let accountId;

// Initialize wallet selector
async function initWalletSelector() {
  try {
    console.log('Initializing wallet selector...');
    selector = await setupWalletSelector({
      network: getCurrentNetworkId(),
      modules: [setupMyNearWallet(), setupMeteorWallet()],
    });

    modal = setupModal(selector, {
      onComplete: async () => {
        console.log('Modal complete - getting wallet...');
        try {
          const wallet = await selector.wallet();
          accountId = (await wallet.getAccounts())[0]?.accountId;
          console.log('Account ID after login:', accountId);
          updateLoginButton();
          updateNetworkToggleState();
          console.log('Hiding modal after successful login...');
          modal.hide();
        } catch (err) {
          console.error('Error during wallet connection:', err);
        }
      },
      onHide: () => {
        console.log('Modal hide event triggered');
        console.log('Modal hidden - updating button...');
        updateLoginButton();
      }
    });

    // Get existing accountId if already signed in
    const wallet = await selector.wallet();
    accountId = (await wallet.getAccounts())[0]?.accountId;
    updateLoginButton();

    // Subscribe to changes
    selector.on("accountsChanged", (e) => {
      console.log('Accounts changed event:', e);
      accountId = e.accounts[0]?.accountId;
      updateLoginButton();
    });

    // Additional event listeners for wallet state changes
    selector.on("signedIn", () => {
      console.log('User signed in event triggered');
      updateLoginButton();
    });

    selector.on("signedOut", () => {
      console.log('User signed out event triggered');
      updateLoginButton();
    });

    // Disable network toggle when logged in
    updateNetworkToggleState();
  } catch (err) {
    console.error('Failed to initialize wallet selector:', err);
  }
}

// Update login button text based on connection status
function updateLoginButton() {
  const loginButton = document.getElementById('near_login_button');
  if (!loginButton) {
    console.warn('Login button not found in DOM');
    return;
  }
  
  console.log('Updating login button with account:', accountId);
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