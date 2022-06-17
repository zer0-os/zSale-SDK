import * as ethers from "ethers";
import { ClaimWithChildSale } from "../../contracts/types/ClaimWithChildSale";

import { SaleStatus } from "../../types";

export const getSaleStatus = async (contract: ClaimWithChildSale) => {
  const saleStarted = await contract.saleStarted();

  if (!saleStarted) {
    return SaleStatus.NotStarted;
  }

  const currentBlock = await contract.provider.getBlockNumber();
  const startBlock = await contract.saleStartBlock();

  const numSold = await contract.domainsSold();
  const totalForSale = await contract.totalForSale();
  if (numSold.gt(totalForSale)) {
    return SaleStatus.Ended;
  }
  const duration = await contract.saleDuration();

  if (ethers.BigNumber.from(currentBlock).gt(startBlock.add(duration))) {
    return SaleStatus.Ended;
  }
  return SaleStatus.PrivateSale;
};
