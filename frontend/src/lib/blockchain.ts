import { ethers } from 'ethers';

// Blockchain connection utilities
export async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  
  return { provider, signer };
}

export async function getContract(address: string, abi: any, signer: ethers.Signer) {
  return new ethers.Contract(address, abi, signer);
}
