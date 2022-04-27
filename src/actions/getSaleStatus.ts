import * as ethers from "ethers";
import { AirWild2Sale } from "../contracts/types";

import { SaleStatus } from "../types";

export const getSaleStatus = async (contract: AirWild2Sale) => {
  const saleStarted = await contract.saleStarted();
  const firstSaleIndex = 0;
  const secondSaleIndex = 1;

  if (!saleStarted) return SaleStatus.NotStarted;

  const currentBlock = await contract.provider.getBlockNumber();
  const startBlock = await contract.saleStartBlock();
  const firstDuration = await contract.mintlistDurations(firstSaleIndex);
  const secondDuration = await contract.mintlistDurations(secondSaleIndex);

  if (ethers.BigNumber.from(currentBlock).gt(startBlock.add(firstDuration))) {
    const currentMintlist = await contract.currentMerkleRootIndex();

    if (currentMintlist.toNumber() >= 1) {
      return SaleStatus.PublicSale;
    }

    const numSold = await contract.domainsSold();
    const totalForSale = await contract.totalForSale();

    if (totalForSale >= numSold) {
      return SaleStatus.Ended;
    }
  }

  if (ethers.BigNumber.from(currentBlock).gt(startBlock.add(secondDuration))) {
    return SaleStatus.Ended;
  }
  return SaleStatus.PrivateSale;
};
