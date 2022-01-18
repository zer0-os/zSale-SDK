import { ethers } from "ethers";
import { WhiteListSimpleSale } from "../contracts/types";
import { SaleData } from "../types";

export const getSaleData = async (
  contract: WhiteListSimpleSale,
  isEth: boolean
): Promise<SaleData> => {
  const started = await contract.saleStarted();

  const startBlock = started
    ? (await contract.saleStartBlock()).toNumber()
    : undefined;

  let saleToken;

  try {
    // It is possible the user misconfigures the SDK upon creation
    // and as a result the `saleToken()` function may not exist on
    // the smart contract, even if `isEth` is false
    saleToken = isEth ? undefined : await contract.saleToken();
  } catch (e) {
    console.log(e);
  }

  return {
    amountSold: (await contract.domainsSold()).toNumber(),
    amountForSale: (await contract.totalForSale()).toNumber(),
    salePrice: ethers.utils.formatEther(await contract.salePrice()),
    started: started,
    whitelistDuration: (await contract.whitelistSaleDuration()).toNumber(),
    paused: await contract.paused(),
    currentMaxPurchases: (await contract.currentMaxPurchaseCount()).toNumber(),
    maxPurchasesDuringWhitelist: (
      await contract.maxPurchasesPerAccount()
    ).toNumber(),
    maxPurchasesPostWhitelist: (
      await contract.postWhitelistMaxPurchases()
    ).toNumber(),
    isEth: isEth,
    startBlock: startBlock,
    saleToken: saleToken,
  } as SaleData;
};
