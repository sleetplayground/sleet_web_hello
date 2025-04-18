document.addEventListener('DOMContentLoaded', initNetworkToggle);

function initNetworkToggle() {
  const button = document.getElementById('network_toggle_button');

  if (!button) return; // Avoid errors if the button isn't found

  let currentNetworkId = localStorage.getItem('networkId') || 'testnet';

  button.textContent = currentNetworkId.toUpperCase();

  button.addEventListener('click', toggleNetwork);
}

function toggleNetwork() {
  let currentNetworkId = localStorage.getItem('networkId') || 'testnet';

  currentNetworkId = currentNetworkId === 'mainnet' ? 'testnet' : 'mainnet';
  localStorage.setItem('networkId', currentNetworkId);

  const button = document.getElementById('network_toggle_button');
  if (button) {
    button.textContent = currentNetworkId.toUpperCase();
  }
}
