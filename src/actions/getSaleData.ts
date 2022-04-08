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

  return {
    amountSold: (await contract.domainsSold()).toNumber(),
    amountForSale: (await contract.publicSaleQuantity()).toNumber(),
    amountForSalePrivate: (await contract.privateSaleQuantity()).toNumber(),
    salePrice: ethers.utils.formatEther(await contract.salePrice()),
    started: started,
    mintlistDuration: (await contract.privateSaleDuration()).toNumber(),
    paused: await contract.paused(),
    startBlock: startBlock,
  } as SaleData;
};
