import { GenSale } from "../../contracts/types";
import { GenSaleStatus, Mintlist } from "../../types";
import { getSaleStatus } from "./getSaleStatus";

export const numberPurchasableByAccount = async (
    mintlist: Mintlist,
    contract: GenSale,
    account: string
): Promise<number> => {
    const status = await getSaleStatus(contract);
    const transactonLimit = await contract.limitPerTransaction();
    const userClaim = mintlist.claims[account];
    if (userClaim) {
        if (status == GenSaleStatus.PrivateSale) {
            return transactonLimit.toNumber();
        } else if (status === GenSaleStatus.NotStarted || status === GenSaleStatus.ClaimSale) {
            return userClaim.quantity;
        }
    }

    return 0;
};
