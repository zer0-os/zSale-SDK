import * as ethers from "ethers";
import { MintlistSimpleFolderIndexSale } from "../contracts/types";

import { SaleStatus } from "../types";

export const getSaleStatus = async (contract: MintlistSimpleFolderIndexSale) => {
  const saleStarted = await contract.saleStarted();

  if (!saleStarted) return SaleStatus.NotStarted;

  const currentBlock = await contract.provider.getBlockNumber();
  const startBlock = await contract.saleStartBlock();
  const duration = await contract.mintlistSaleDuration();

  if (ethers.BigNumber.from(currentBlock).gt(startBlock.add(duration))) {
    return SaleStatus.Ended
  }

  return SaleStatus.MintlistOnly;
};
