import { NetworkId, HelloContract, NearBlocksUrl } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('network_toggle_button');

  // Set initial button text
  button.textContent = `Network: ${NetworkId}`;

  button.addEventListener('click', () => {
    // Toggle network ID
    const newNetworkId = NetworkId === 'mainnet' ? 'testnet' : 'mainnet';
    localStorage.setItem('networkId', newNetworkId);

    // Update button text
    button.textContent = `Network: ${newNetworkId}`;

    // Optionally, reload the page to apply changes
    // location.reload();
  });
});