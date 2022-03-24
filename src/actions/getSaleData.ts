import { ethers } from "ethers";
import { MintlistSimpleFolderIndexSale } from "../contracts/types";
import { SaleData } from "../types";

export const getSaleData = async (
  contract: MintlistSimpleFolderIndexSale,
  isEth: boolean
): Promise<SaleData> => {
  const started = await contract.saleStarted();

  const startBlock = started
    ? (await contract.saleStartBlock()).toNumber()
    : undefined;

  return {
    amountSold: (await contract.domainsSold()).toNumber(),
    amountForSale: (await contract.totalForSale()).toNumber(),
    salePrice: ethers.utils.formatEther(await contract.salePrice()),
    started: started,
    mintlistDuration: (await contract.mintlistSaleDuration()).toNumber(),
    paused: await contract.paused(),
    startBlock: startBlock,
  } as SaleData;
};
