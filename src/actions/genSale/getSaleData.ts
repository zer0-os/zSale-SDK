import { ethers } from "ethers";
import { GenSale } from "../../contracts/types";
import { GenSaleData } from "../../types";

export const getSaleData = async (
    contract: GenSale,
    isEth: boolean
): Promise<GenSaleData> => {
    const started = await contract.saleStarted();

    const startBlock = started
        ? (await contract.saleStartBlock()).toNumber()
        : undefined;

    const amountForSale = (await contract.amountForSale()).toNumber();
    const limitPerTransaction = (await contract.limitPerTransaction()).toNumber();

    const saleData: GenSaleData = {
        amountSold: (await contract.domainsSold()).toNumber(),
        amountForSale: amountForSale,
        salePrice: ethers.utils.formatEther(await contract.salePrice()),
        started: started,
        paused: await contract.paused(),
        startBlock: startBlock,
        advanced: {
            amountForSale: amountForSale,
        },
        limitPerTransaction: limitPerTransaction
    };
    return saleData;
};
