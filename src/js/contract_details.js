import { getCurrentNetworkId, getHelloContract } from './config';

function getExplorerUrl(networkId, path) {
    return `https://${networkId === 'mainnet' ? '' : networkId + '.'}explorer.near.org${path}`;
}

async function updateContractDetails() {
    const contractDetailsSection = document.getElementById('greeting_contract_details');
    const networkId = getCurrentNetworkId();
    const contractId = getHelloContract();
    
    // Create contract info elements
    const contractTitle = document.createElement('h3');
    contractTitle.textContent = 'Contract Details';
    
    const contractAddress = document.createElement('p');
    const contractLink = document.createElement('a');
    contractLink.href = getExplorerUrl(networkId, `/accounts/${contractId}`);
    contractLink.textContent = contractId;
    contractLink.target = '_blank';
    contractAddress.appendChild(document.createTextNode('Contract Address: '));
    contractAddress.appendChild(contractLink);
    
    const txHistoryLink = document.createElement('a');
    txHistoryLink.href = getExplorerUrl(networkId, `/accounts/${contractId}/transactions`);
    txHistoryLink.textContent = 'View Transaction History';
    txHistoryLink.target = '_blank';
    txHistoryLink.className = 'tx-history-link';
    
    // Clear existing content
    contractDetailsSection.innerHTML = '';
    
    // Add elements to the section
    contractDetailsSection.appendChild(contractTitle);
    contractDetailsSection.appendChild(contractAddress);
    contractDetailsSection.appendChild(txHistoryLink);
}

// Update contract details when network changes
document.addEventListener('networkChanged', updateContractDetails);

// Initial update
updateContractDetails();