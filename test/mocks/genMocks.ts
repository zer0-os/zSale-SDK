import "mocha";
import {
    BigNumber,
    ContractTransaction,
    ethers,
    Signer,
} from "ethers";
import { Block, Provider } from "@ethersproject/providers";
import { GenSale } from "../../src/contracts";

export const feb23TsSeconds = 1677173138;
export const feb24TsSeconds = 1677264314;

export type GenMocks = {
    signer: Partial<Signer>;
    genSale: Partial<GenSale>;
    currentSaleConfiguration: SaleConfig;
    currentSaleStarted: boolean;
    currentAmountForSale: BigNumber;
    currentTransactionLimit: BigNumber;
    currentSalePrice: BigNumber;
    currentDomainsSold: BigNumber;
    currentSaleStartTimestamp: BigNumber;
    currentLatestBlock: Partial<Block>;
    currentSaleId: string;
    currentSaleCounter: BigNumber;
    currentPauseStatus: boolean;
    currentSignerFunds: ethers.BigNumber;
    currentDomainsPurchasedByAccount: BigNumber;
    reset: () => void;
};

export interface SaleConfig {
    sellerWallet: string;
    parentDomainId: BigNumber;
    salePrice: BigNumber;
    amountForSale: BigNumber;
    mintlistMerkleRoot: string;
    startingMetadataIndex: BigNumber;
    folderGroupID: BigNumber;
    transactionLimit: BigNumber;
};

export const genSaleConfig: SaleConfig = {
    sellerWallet: "0x1234567890123456789012345678901234567890",
    parentDomainId: BigNumber.from(123),
    salePrice: ethers.utils.parseEther("1.0"), // 1 ^ 18th
    amountForSale: BigNumber.from(50),
    mintlistMerkleRoot: "0xabcdef1234567890abcdef1234567890abcdef12",
    startingMetadataIndex: BigNumber.from(1),
    folderGroupID: BigNumber.from(2),
    transactionLimit: BigNumber.from(10),
}

export let mocks: GenMocks = {
    currentSaleStarted: false,
    currentSalePrice: BigNumber.from(0),
    currentSaleConfiguration: genSaleConfig,
    currentDomainsSold: BigNumber.from(0),
    currentSaleStartTimestamp: BigNumber.from(feb23TsSeconds), // ~2/23/2023
    currentLatestBlock: { timestamp: feb24TsSeconds }, // ~2/24/2023
    currentSaleId: "12345",
    currentSaleCounter: BigNumber.from(1),
    currentPauseStatus: false,
    currentSignerFunds: ethers.utils.parseEther("10.0"),
    currentDomainsPurchasedByAccount: BigNumber.from(0),
    currentTransactionLimit: BigNumber.from(10),
    currentAmountForSale: BigNumber.from(50),

    signer: {
        getAddress: async () => "0x1234567890123456789012345678901234567890",
        getBalance: async () => mocks.currentSignerFunds,
    },
    genSale: {
        provider: {
            async getBlock(): Promise<Block> {
                return Promise.resolve(mocks.currentLatestBlock as Block);
            },
        } as unknown as Provider,

        async domainsSold(): Promise<BigNumber> {
            return mocks.currentDomainsSold;
        },

        async paused(): Promise<boolean> {
            return mocks.currentPauseStatus;
        },

        async domainsPurchasedByAccount(
        ): Promise<BigNumber> {
            return mocks.currentDomainsPurchasedByAccount;
        },

        async purchaseDomains(_count: BigNumber, _index: BigNumber, _purchaseLimit: BigNumber): Promise<ContractTransaction> {
            return "purchased" as unknown as ContractTransaction;
        },
        async setPauseStatus(_status: boolean): Promise<ContractTransaction> {
            return "toggled" as unknown as ContractTransaction;
        },
        async saleStarted(): Promise<boolean> {
            return mocks.currentSaleStarted;
        },
        async salePrice(): Promise<BigNumber> {
            return mocks.currentSalePrice;
        },
        async amountForSale(): Promise<BigNumber> {
            return mocks.currentAmountForSale;
        },
        async limitPerTransaction(): Promise<BigNumber> {
            return mocks.currentTransactionLimit;
        },
        connect: () => mocks.genSale as any,
    },
    async reset() {
        // reset any modifications made to contract state
        mocks.currentSaleConfiguration = genSaleConfig;
        mocks.currentTransactionLimit = BigNumber.from(10);
        mocks.currentDomainsSold = BigNumber.from(5);
        mocks.currentSaleStartTimestamp = BigNumber.from(feb23TsSeconds); // ~2/23/2023
        mocks.currentLatestBlock = { timestamp: feb24TsSeconds }; // ~2/24/2023
        mocks.currentSaleId = "12345";
        mocks.currentSaleCounter = BigNumber.from(1);
        mocks.currentPauseStatus = false;
        mocks.currentDomainsPurchasedByAccount = BigNumber.from(0);
    },
};
