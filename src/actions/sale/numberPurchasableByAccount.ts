import { Sale } from "../../contracts/types";
import { Mintlist, SalePhase } from "../../types";

export const numberPurchasableByAccount = async (
  mintlist: Mintlist,
  contract: Sale,
  account: string,
): Promise<number> => {
  const salePhase: SalePhase = (await contract.salePhase()) as SalePhase;
  const saleConfig = (await contract.saleConfiguration());
  const publicSalePurchaseLimit = saleConfig.publicSaleLimit.toNumber();

  if (salePhase === SalePhase.Inactive) {
    return 0;
  }

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
