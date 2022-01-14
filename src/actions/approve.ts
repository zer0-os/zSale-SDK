import { ethers } from "ethers";

const erc20Abi = [
  "function approve(address spender, uint256 amount) external",
];

// Approve the spender to use `amount` of tokens on behalf of signer
export const approve = async (
  saleTokenAddress: string, // e.g. an ERC20 such as wETH or WILD
  spenderAddress: string, // The sale contract
  signer: ethers.Signer
): Promise<ethers.ContractTransaction> => {
  const token = new ethers.Contract(saleTokenAddress, erc20Abi, signer);

  const signerAddress = await signer.getAddress();

  // Check allowance first to see if approval is needed
  const allowance = await token.allowance(signerAddress, spenderAddress);
  if (allowance.gt("0")) throw Error("Spender is already approved");

  const tx = await token.connect(signer).approve(spenderAddress, Number.MAX_SAFE_INTEGER - 1);
  return tx;
}