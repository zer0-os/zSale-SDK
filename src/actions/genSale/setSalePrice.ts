import { ethers } from "ethers";
import { GenSale } from "../../contracts/types";

export const setSalePrice = async (
    newSalePrice: ethers.BigNumber,
    saleContract: GenSale,
    signer: ethers.Signer
): Promise<ethers.ContractTransaction> => {
    const currentPrice = await saleContract.salePrice();
    if (currentPrice === newSalePrice) {
        throw Error("Execution would cause no state change");
    }

    const tx = await saleContract.connect(signer).setSalePrice(newSalePrice);
    return tx;
};
