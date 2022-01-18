import { ethers } from "ethers";
import { getWhiteListSaleContract } from "../contracts";
import { Config } from "../types";

const erc20Abi = ["function approve(address spender, uint256 amount) external"];

// Approve the spender to use `amount` of tokens on behalf of signer
export const approve = async (
  config: Config,
  signer: ethers.Signer,
  amount?: ethers.BigNumber
): Promise<ethers.ContractTransaction> => {
  if (config.isEth) {
    throw Error(
      "The SDK is configured to do sales in Ethereum, not an ERC20 token, so you cannot call to `approve`"
    );
  }

  const contract = await getWhiteListSaleContract(signer, config.contractAddress);
  const tokenAddress = await contract.saleToken();
  const token = new ethers.Contract(tokenAddress, erc20Abi, signer);

  const setAmount = amount ? amount : Number.MAX_SAFE_INTEGER - 1;

  const tx = await token
    .connect(signer)
    .approve(config.contractAddress, setAmount);
  return tx;
};
