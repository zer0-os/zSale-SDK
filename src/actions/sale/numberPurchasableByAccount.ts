import { Sale } from "../../contracts/types";
import { Mintlist, SalePhase } from "../../types";

export const numberPurchasableByAccount = async (
  mintlist: Mintlist,
  contract: Sale,
  account: string,
  publicSalePurchaseLimit: number // REQ why is this passed in? Get it from sale config?
): Promise<number> => {
  const salePhase: SalePhase = (await contract.salePhase()) as SalePhase;

  if (
    salePhase === SalePhase.ReadyForNewSale ||
    salePhase === SalePhase.Private
  ) {
    const userClaim = mintlist.claims[account];
    if (userClaim) {
      return userClaim.quantity;
    }

    return 0;
  }

  return publicSalePurchaseLimit;
};
