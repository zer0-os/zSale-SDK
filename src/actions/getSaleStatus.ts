import * as ethers from "ethers";
import { WhiteListSimpleSale } from "../contracts/types";

import { SaleStatus } from "../types";

export const getSaleStatus = async (contract: WhiteListSimpleSale) => {
  const saleStarted = await contract.saleStarted();

  if (!saleStarted) return SaleStatus.NotStarted;

  const currentBlock = await contract.provider.getBlockNumber();
  const startBlock = await contract.saleStartBlock();
  const duration = await contract.whitelistSaleDuration();

  if (ethers.BigNumber.from(currentBlock).gt(startBlock.add(duration)))
    return SaleStatus.Public;

  return SaleStatus.WhiteListOnly;
};
