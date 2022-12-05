import { ethers } from "ethers";
import { WapeSale } from "../../contracts/types";
import { WapeSaleData } from "../../types";

export const getSaleData = async (
  contract: WapeSale,
  isEth: boolean
): Promise<WapeSaleData> => {
  const started = await contract.saleStarted();
  const privateSaleIndex = 0;

  const startBlock = started
    ? (await contract.saleStartBlock()).toNumber()
    : undefined;

  const privateSaleDuration = (
    await contract.mintlistSaleDuration()
  ).toNumber();

  const publicSaleStartBlock =
    started && startBlock ? startBlock + privateSaleDuration : undefined;

  const amountForSale = (await contract.amountForSale()).toNumber();

  const saleData: WapeSaleData = {
    amountSold: (await contract.domainsSold()).toNumber(),
    amountForSale: amountForSale,
    salePrice: ethers.utils.formatEther(await contract.salePrice()),
    started: started,
    privateSaleDuration,
    paused: await contract.paused(),
    startBlock: startBlock,
    publicSaleStartBlock,
    advanced: {
      amountForSalePrivate: amountForSale,
      amountForSalePublic: amountForSale,
    },
  };
  return saleData;
};
