import * as ethers from "ethers";
import { AirWild2Sale } from "../contracts/types";

import { SaleStatus } from "../types";

export const getSaleStatus = async (contract: AirWild2Sale) => {
  const saleStarted = await contract.saleStarted();

  if (!saleStarted) return SaleStatus.NotStarted;

  const currentBlock = await contract.provider.getBlockNumber();
  const startBlock = await contract.saleStartBlock();
  const duration = await contract.mintlistDurations(
    await contract.currentMerkleRootIndex()
  );

  if (ethers.BigNumber.from(currentBlock).gt(startBlock.add(duration))) {
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

  return SaleStatus.PrivateSale;
};
