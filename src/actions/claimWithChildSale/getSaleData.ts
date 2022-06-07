import { ethers } from "ethers";
import { ClaimWithChildSale } from "../../contracts/types/ClaimWithChildSale";
import { ClaimWithChildSaleData } from "../../types";

export const getSaleData = async (
  contract: ClaimWithChildSale,
  isEth: boolean
): Promise<ClaimWithChildSaleData> => {
  const started = await contract.saleStarted();

  const startBlock = started
    ? (await contract.saleStartBlock()).toNumber()
    : undefined;

  const saleDuration = (await contract.saleDuration()).toNumber();

  const saleData: ClaimWithChildSaleData = {
    amountSold: (await contract.domainsSold()).toNumber(),
    amountForSale: (await contract.totalForSale()).toNumber(),
    salePrice: ethers.utils.formatEther(await contract.salePrice()),
    started: started,
    saleDuration: saleDuration,
    paused: await contract.paused(),
    startBlock: startBlock,
  };
  return saleData;
};
