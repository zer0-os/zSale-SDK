import { ethers } from "ethers";

const erc20Abi = [
  "function balanceOf(address account) external"
];

// Get the balance of the given address
export const balanceOf = async (
  saleTokenAddress: string, // e.g. an ERC20 such as wETH or WILD
  signer: ethers.Signer
): Promise<ethers.BigNumber> => {
  const token = new ethers.Contract(saleTokenAddress, erc20Abi, signer);

  const signerAddress = await signer.getAddress();

  const balance = await token.balanceOf(signerAddress);
  return balance;
}
