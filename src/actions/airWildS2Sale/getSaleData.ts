import { ethers } from "ethers";
import { AirWild2Sale } from "../../contracts/types";
import { AirWildS2SaleData } from "../../types";

export const getSaleData = async (
  contract: AirWild2Sale,
  isEth: boolean
): Promise<AirWildS2SaleData> => {
  const started = await contract.saleStarted();
  const privateSaleIndex = 0;

  const startBlock = started
    ? (await contract.saleStartBlock()).toNumber()
    : undefined;

  const privateSaleDuration = (
    await contract.mintlistDurations(privateSaleIndex)
  ).toNumber();

  const publicSaleStartBlock =
    started && startBlock ? startBlock + privateSaleDuration : undefined;

  const saleData: AirWildS2SaleData = {
    amountSold: (await contract.domainsSold()).toNumber(),
    amountForSale: (await contract.totalForSale()).toNumber(),
    salePrice: ethers.utils.formatEther(await contract.salePrice()),
    started: started,
    privateSaleDuration,
    paused: await contract.paused(),
    startBlock: startBlock,
    publicSaleStartBlock,
    advanced: {
      amountForSalePrivate: (await contract.totalForSale()).toNumber(),
      amountForSalePublic: (await contract.totalForSale()).toNumber(),
    },
  };
  return saleData;
};
