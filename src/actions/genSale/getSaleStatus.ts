import { BigNumber } from "ethers/lib/ethers";
import { GenSale } from "../../contracts/types";
import { GenSaleStatus } from "../../types";

export const getSaleStatus = async (contract: GenSale) => {
    const saleStarted = await contract.saleStarted();

    if (!saleStarted) {
        return GenSaleStatus.NotStarted;
    }

    const saleDataPromises = [
        contract.domainsSold(),
        contract.amountForSale(),
        contract.salePrice(),
    ];

    const [
        numSold,
        totalForSale,
        price
    ] = await Promise.all(saleDataPromises)

    if (numSold.gte(totalForSale)) {
        return GenSaleStatus.Ended;
    }

    if (price.gt(BigNumber.from(0))) {
        if (saleStarted) {
            return GenSaleStatus.PrivateSale;
        }
    }
    return GenSaleStatus.ClaimSale;
};
