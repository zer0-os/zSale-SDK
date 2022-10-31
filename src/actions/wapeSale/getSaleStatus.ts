import * as ethers from "ethers";
import { WapeSale } from "../../contracts/types";
import { SaleStatus } from "../../types";

export const getSaleStatus = async (contract: WapeSale) => {
  const saleStarted = await contract.saleStarted();

  if (!saleStarted) {
    return SaleStatus.NotStarted;
  }

  const currentBlock = await contract.provider.getBlockNumber();
  const startBlock = await contract.saleStartBlock();

  const numSold = await contract.domainsSold();
  const totalForSale = await contract.amountForSale();
  if (numSold.gte(totalForSale)) {
    return SaleStatus.Ended;
  }
  const duration = await contract.mintlistSaleDuration();

  if (ethers.BigNumber.from(currentBlock).gt(startBlock.add(duration))) {
    if (await contract.saleStarted()) {
      return SaleStatus.PublicSale;
    }
    return SaleStatus.Ended;
  }
  return SaleStatus.PrivateSale;
};
