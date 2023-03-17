import { ethers } from "ethers";
import { GenSale } from "../../contracts/types";
import { GenSaleData } from "../../types";
import { getSaleStatus } from "./getSaleStatus";

export const getSaleData = async (
  contract: GenSale
): Promise<GenSaleData> => {
  const started = await contract.saleStarted();

  const startBlock = started
    ? (await contract.saleStartBlock()).toNumber()
    : undefined;

  const amountForSale = (await contract.amountForSale()).toNumber();
  const limitPerTransaction = (await contract.limitPerTransaction()).toNumber();

  const saleData: GenSaleData = {
    amountSold: (await contract.domainsSold()).toNumber(),
    amountForSale: amountForSale,
    salePrice: ethers.utils.formatEther(await contract.salePrice()),
    started: started,
    paused: await contract.paused(),
    startBlock: startBlock,
    limitPerTransaction: limitPerTransaction,
    saleStatus: await getSaleStatus(contract)
  };
  return saleData;
};
