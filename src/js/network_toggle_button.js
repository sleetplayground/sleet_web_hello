
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('network_toggle_button');

  // Retrieve the current network ID from localStorage
  let currentNetworkId = localStorage.getItem('networkId') || 'testnet';

  // Set initial button text
  button.textContent = currentNetworkId.toUpperCase();

  button.addEventListener('click', () => {
    // Toggle network ID
    currentNetworkId = currentNetworkId === 'mainnet' ? 'testnet' : 'mainnet';
    localStorage.setItem('networkId', currentNetworkId);

    // Update button text
    button.textContent = currentNetworkId.toUpperCase();
  });
});