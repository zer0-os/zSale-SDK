import { ethers } from "ethers";
import { WhiteListSimpleSale } from "../contracts/types";
import { SaleData } from "../types";

export const getSaleData = async (
  contract: WhiteListSimpleSale,
  isEth: boolean
): Promise<SaleData> => {
  const started = await contract.saleStarted();

  const startBlock = started
    ? await (await contract.saleStartBlock()).toNumber()
    : undefined;

  const saleToken = isEth
    ? undefined
    : await contract.saleToken();

  return {
    amountSold: await (await contract.domainsSold()).toNumber(),
    amountForSale: await (await contract.totalForSale()).toNumber(),
    salePrice: ethers.utils.formatEther(await (await contract.salePrice())),
    started: started,
    whitelistDuration: await (await contract.whitelistSaleDuration()).toNumber(),
    paused: await contract.paused(),
    currentMaxPurchases: await (await contract.currentMaxPurchaseCount()).toNumber(),
    maxPurchasesDuringWhitelist: await (await contract.maxPurchasesPerAccount()).toNumber(),
    maxPurchasesPostWhitelist: await (await contract.postWhitelistMaxPurchases()).toNumber(),
    isEth: isEth,
    startBlock: startBlock,
    saleToken: saleToken
  } as SaleData
}