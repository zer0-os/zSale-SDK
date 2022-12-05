import * as ethers from "ethers";
import { WapeSale } from "../../contracts/types";
import { SaleStatus } from "../../types";

export const getSaleStatus = async (contract: WapeSale) => {
  const saleStarted = await contract.saleStarted();

  if (!saleStarted) {
    return SaleStatus.NotStarted;
  }


  const saleDataPromises = [
    contract.domainsSold(),
    contract.amountForSale(),
    contract.saleStartBlock(),
    contract.mintlistSaleDuration(),
  ];

  const [
    numSold,
    totalForSale,
    startBlock,
    duration
  ] = await Promise.all(saleDataPromises)

  if (numSold.gte(totalForSale)) {
    return SaleStatus.Ended;
  }
  
  const currentBlock = contract.provider.getBlockNumber();

  if (ethers.BigNumber.from(currentBlock).gt(startBlock.add(duration))) {
    if (saleStarted) {
      return SaleStatus.PublicSale;
    }
    return SaleStatus.Ended;
  }
  return SaleStatus.PrivateSale;
};
