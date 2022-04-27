import { AirWild2Sale } from "../contracts/types";
import { Mintlist, SaleStatus } from "../types";
import { getSaleStatus } from "./getSaleStatus";

export const numberPurchasableByAccount = async (
  mintlist: Mintlist,
  contract: AirWild2Sale,
  account: string,
  publicSalePurchaseLimit: number
): Promise<number> => {
  const status = await getSaleStatus(contract);

  if (status === SaleStatus.NotStarted || status == SaleStatus.PrivateSale) {
    const userClaim = mintlist.claims[account];
    if (userClaim) {
      return userClaim.quantity;
    }

    return 0;
  }

  return publicSalePurchaseLimit;
};
