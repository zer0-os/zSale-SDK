import { GenSale } from "../../contracts/types";
import { GenSaleStatus, Mintlist } from "../../types";
import { getSaleStatus } from "./getSaleStatus";

export const numberPurchasableByAccount = async (
  mintlist: Mintlist,
  contract: GenSale,
  account: string
): Promise<number> => {
  const userClaim = mintlist.claims[account];

  if (!userClaim) return 0;

  const status = await getSaleStatus(contract);

  if (status == GenSaleStatus.PrivateSale) {
    const transactonLimit = await contract.limitPerTransaction();

    return transactonLimit.toNumber();
  } else if (status === GenSaleStatus.NotStarted || status === GenSaleStatus.ClaimSale) {
    const amountPurchased = await contract.domainsPurchasedByAccount(account)

    const diff = userClaim.quantity - amountPurchased.toNumber()
    return diff;
  }
  return 0;
};
