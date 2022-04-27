import * as ethers from "ethers";
import { AirWild2Sale } from "../contracts/types";

import { SaleStatus } from "../types";

export const getSaleStatus = async (contract: AirWild2Sale) => {
  const saleStarted = await contract.saleStarted();
  const firstSaleIndex = 0;

  if (!saleStarted) {
    return SaleStatus.NotStarted;
  }

  const currentBlock = await contract.provider.getBlockNumber();
  const startBlock = await contract.saleStartBlock();

  const numSold = await contract.domainsSold();
  const totalForSale = await contract.totalForSale();
  if (numSold >= totalForSale) {
    return SaleStatus.Ended;
  }
  const currentMintlist = (await contract.currentMerkleRootIndex()).toNumber();
  const duration = await contract.mintlistDurations(currentMintlist);

  if (ethers.BigNumber.from(currentBlock).gt(startBlock.add(duration))) {
    return SaleStatus.Ended;
  }
  return currentMintlist == firstSaleIndex
    ? SaleStatus.PrivateSale
    : SaleStatus.PublicSale;
};
