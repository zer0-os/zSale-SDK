import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { getWhiteListSaleContract } from "../contracts";
import { Config } from "../types";

dotenv.config();

const erc20Abi = [
  "function allowance(address owner, address spender) external",
];

// Check the allowance of the spender to use tokens on behalf of the signer
export const allowance = async (
  config: Config, // The sale contract
  userAddress: string,
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
): Promise<ethers.BigNumber> => {
  if (config.isEth) {
    throw Error(
      "The SDK is configured to do sales in Ethereum, not an ERC20 token, so you cannot call to `allowance`"
    );
  }

  const contract = await getWhiteListSaleContract(signerOrProvider, config.contractAddress)
  const tokenAddress = await contract.saleToken();
  const token = new ethers.Contract(tokenAddress, erc20Abi, signerOrProvider);

  // Owner, spender
  const allowance = await token.allowance(userAddress, config);
  return allowance;
};
