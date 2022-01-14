import { ethers } from "ethers";

const erc20Abi = [
  "function allowance(address owner, address spender) external",
];

// Check the allowance of the spender to use tokens on behalf of the signer
export const allowance = async (
  saleTokenAddress: string, // e.g. an ERC20 such as wETH or WILD
  spenderAddress: string, // The sale contract
  signer: ethers.Signer
): Promise<ethers.BigNumber> => {
  const token = new ethers.Contract(saleTokenAddress, erc20Abi, signer);

  const signerAddress = await signer.getAddress();

  // Owner, spender
  const allowance = await token.allowance(signerAddress, spenderAddress);
  return allowance;
}
