import { ethers } from "ethers";
import { WolfSale } from "../contracts/types";
import { SaleData } from "../types";

export const getSaleData = async (
  contract: WolfSale,
  isEth: boolean
): Promise<SaleData> => {
  const started = await contract.saleStarted();

  const startBlock = started
    ? (await contract.saleStartBlock()).toNumber()
    : undefined;

  const privateSaleDuration = (await contract.privateSaleDuration()).toNumber();

  const publicSaleStartBlock =
    started && startBlock ? startBlock + privateSaleDuration : undefined;

  const saleData: SaleData = {
    amountSold: (await contract.domainsSold()).toNumber(),
    amountForSale: (await contract.numberForSaleForCurrentPhase()).toNumber(),
    salePrice: ethers.utils.formatEther(await contract.salePrice()),
    started: started,
    privateSaleDuration,
    paused: await contract.paused(),
    startBlock: startBlock,
    publicSaleStartBlock,
    advanced: {
      amountForSalePrivate: (await contract.privateSaleQuantity()).toNumber(),
      amountForSalePublic: (await contract.publicSaleQuantity()).toNumber(),
    },
  };
  return saleData;
};
