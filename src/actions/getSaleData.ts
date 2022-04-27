import { ethers } from "ethers";
import { AirWild2Sale } from "../contracts/types";
import { SaleData } from "../types";

export const getSaleData = async (
  contract: AirWild2Sale,
  isEth: boolean
): Promise<SaleData> => {
  const started = await contract.saleStarted();
  const PRIVATE_SALE_INDEX = 0;

  const startBlock = started
    ? (await contract.saleStartBlock()).toNumber()
    : undefined;

  const privateSaleDuration = (
    await contract.mintlistDurations(PRIVATE_SALE_INDEX)
  ).toNumber();

  const publicSaleStartBlock =
    started && startBlock ? startBlock + privateSaleDuration : undefined;

  const saleData: SaleData = {
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
