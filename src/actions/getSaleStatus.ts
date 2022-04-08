import * as ethers from "ethers";
import { WolfSale } from "../contracts/types";

import { SaleStatus } from "../types";

export const getSaleStatus = async (contract: WolfSale) => {
  const saleStarted = await contract.saleStarted();

  if (!saleStarted) return SaleStatus.NotStarted;

  const currentBlock = await contract.provider.getBlockNumber();
  const startBlock = await contract.saleStartBlock();
  const duration = await contract.privateSaleDuration();

  if (ethers.BigNumber.from(currentBlock).gt(startBlock.add(duration))) {
    if (saleStarted) {
      return SaleStatus.PublicSale;
    }
    return SaleStatus.Ended;
  }

  return SaleStatus.PrivateSale;
};
