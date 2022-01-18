import { ethers, providers } from "ethers";

const erc20Abi = ["function balanceOf(address account) external"];

// Get the balance of the given address
export const balanceOf = async (
  saleTokenAddress: string, // e.g. an ERC20 such as wETH or WILD
  userAddress: string,
  signerOrProvider: ethers.Signer | ethers.providers.Provider
): Promise<ethers.BigNumber> => {
  const token = new ethers.Contract(
    saleTokenAddress,
    erc20Abi,
    signerOrProvider
  );

  const balance = await token.balanceOf(userAddress);
  return balance;
};
