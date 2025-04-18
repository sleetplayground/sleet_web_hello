const contractPerNetwork = {
  mainnet: 'hello.sleet.near',
  testnet: 'hello.sleet.testnet',
};


// /address/ for adreess or /txns/ for transactions
const nearBlocksPerNetwork = {
  mainnet: 'https://nearblocks.io',
  testnet: 'https://testnet.nearblocks.io',
};

const rpcPerNetwork = {
  mainnet: 'https://test.rpc.fastnear.com',
  testnet: 'https://free.rpc.fastnear.com',
};



const networkId = localStorage.getItem('networkId') || 'testnet';

export const NetworkId = networkId;
export const HelloContract = contractPerNetwork[NetworkId];
export const NearBlocksUrl = nearBlocksPerNetwork[NetworkId];
export const NearRpc = rpcPerNetwork[NetworkId];
