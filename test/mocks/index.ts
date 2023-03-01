import nock from "nock";
import { expect } from "chai";
import { numberPurchasableByAccount } from "../../src/actions/sale/numberPurchasableByAccount";
import { Mintlist, SaleContractConfig } from "../../src/types";
import { Sale } from "../../src/contracts/types";
import { SalePhase } from "../../src/types";
import "mocha";
import {
  BigNumber,
  CallOverrides,
  ContractTransaction,
  ethers,
  Signer,
} from "ethers";
import { getMintlist } from "../../src/actions/sale/getMintlist";
import {
  getSaleData,
  getSaleStatus,
  purchaseDomains,
} from "../../src/actions/sale";
import { Block, BlockTag, Provider } from "@ethersproject/providers";
import { SalePhases } from "../../src/constants";

export const feb23TsSeconds = 1677173138;
export const feb24TsSeconds = 1677264314;

export type Mocks = {
  signer: Partial<Signer>;
  sale: Partial<Sale>;
  currentSaleConfiguration: [
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    sellerWallet: string;
    parentDomainId: BigNumber;
    salePrice: BigNumber;
    privateSalePrice: BigNumber;
    mintlistSaleDuration: BigNumber;
    amountForSale: BigNumber;
    mintlistMerkleRoot: string;
    startingMetadataIndex: BigNumber;
    folderGroupID: BigNumber;
    publicSaleLimit: BigNumber;
  };
  currentSalePhase: number;
  currentDomainsSold: BigNumber;
  currentSaleStartTimestamp: BigNumber;
  currentLatestBlock: Partial<Block>;
  currentSaleId: string;
  currentSaleCounter: BigNumber;
  currentPauseStatus: boolean;
  currentSignerFunds: ethers.BigNumber;
  currentDomainsPurchasedByAccountPerSale: BigNumber;
  reset: () => void;
};

export function getDefaultMockSaleConfiguration(): 
  [
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    sellerWallet: string;
    parentDomainId: BigNumber;
    salePrice: BigNumber;
    privateSalePrice: BigNumber;
    mintlistSaleDuration: BigNumber;
    amountForSale: BigNumber;
    mintlistMerkleRoot: string;
    startingMetadataIndex: BigNumber;
    folderGroupID: BigNumber;
    publicSaleLimit: BigNumber;
  }
 {
  return {
    sellerWallet: "0x1234567890123456789012345678901234567890",
    parentDomainId: BigNumber.from(123),
    salePrice: ethers.utils.parseEther("1.0"), // 1 ^ 18th
    privateSalePrice: ethers.utils.parseEther("2.0"), // 2 ^ 18th
    mintlistSaleDuration: BigNumber.from(3600), // ~ 1hr (seconds)
    amountForSale: BigNumber.from(50),
    mintlistMerkleRoot: "0xabcdef1234567890abcdef1234567890abcdef12",
    startingMetadataIndex: BigNumber.from(1),
    folderGroupID: BigNumber.from(2),
    publicSaleLimit: BigNumber.from(10),
  } as any;
}

export let mocks: Mocks = {
  currentSaleConfiguration: getDefaultMockSaleConfiguration(),
  currentSalePhase: SalePhase.Private,
  currentDomainsSold: BigNumber.from(0),
  currentSaleStartTimestamp: BigNumber.from(feb23TsSeconds), // ~2/23/2023
  currentLatestBlock: { timestamp: feb24TsSeconds }, // ~2/24/2023
  currentSaleId: "12345",
  currentSaleCounter: BigNumber.from(1),
  currentPauseStatus: false,
  currentSignerFunds: ethers.utils.parseEther("10.0"),
  currentDomainsPurchasedByAccountPerSale: BigNumber.from(0),

  signer: {
    getAddress: async () => "0x1234567890123456789012345678901234567890",
    getBalance: async () => mocks.currentSignerFunds,
  },

  sale: {
    provider: {
      async getBlock(): Promise<Block> {
        return Promise.resolve(mocks.currentLatestBlock as Block);
      },
    } as unknown as Provider,

    async salePhase(): Promise<number> {
      return mocks.currentSalePhase;
    },

    async saleConfiguration(overrides?: CallOverrides): Promise<
      [
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        string,
        BigNumber,
        BigNumber,
        BigNumber
      ] & {
        sellerWallet: string;
        parentDomainId: BigNumber;
        salePrice: BigNumber;
        privateSalePrice: BigNumber;
        mintlistSaleDuration: BigNumber;
        amountForSale: BigNumber;
        mintlistMerkleRoot: string;
        startingMetadataIndex: BigNumber;
        folderGroupID: BigNumber;
        publicSaleLimit: BigNumber;
      }
    > {
      return mocks.currentSaleConfiguration;
    },

    async domainsSold(): Promise<BigNumber> {
      return mocks.currentDomainsSold;
    },

    async saleStartBlockTimestamp(): Promise<BigNumber> {
      return mocks.currentSaleStartTimestamp;
    },

    async saleId(): Promise<BigNumber> {
      return BigNumber.from(mocks.currentSaleId);
    },

    async saleCounter(): Promise<BigNumber> {
      return mocks.currentSaleCounter;
    },

    async paused(): Promise<boolean> {
      return mocks.currentPauseStatus;
    },

    async purchaseDomainsPrivateSale(
      count: BigNumber,
      index: BigNumber,
      quantity: BigNumber,
      proof: Array<string>
    ): Promise<ContractTransaction> {
      return "private" as unknown as ContractTransaction;
    },

    async domainsPurchasedByAccountPerSale(
      saleId: BigNumber,
      account: string
    ): Promise<BigNumber> {
      return mocks.currentDomainsPurchasedByAccountPerSale;
    },

    async purchaseDomainsPublicSale(
      count: BigNumber,
      overrides: CallOverrides
    ): Promise<ContractTransaction> {
      return "public" as unknown as ContractTransaction;
    },

    connect: () => mocks.sale as any,
  },

  async reset() {
    // reset any modifications made to contract state
    mocks.currentSaleConfiguration = await getDefaultMockSaleConfiguration();
    mocks.currentSalePhase = SalePhase.Private;
    mocks.currentDomainsSold = BigNumber.from(5);
    mocks.currentSaleStartTimestamp = BigNumber.from(feb23TsSeconds); // ~2/23/2023
    mocks.currentLatestBlock = { timestamp: feb24TsSeconds }; // ~2/24/2023
    mocks.currentSaleId = "12345";
    mocks.currentSaleCounter = BigNumber.from(1);
    mocks.currentPauseStatus = false;
    mocks.currentDomainsPurchasedByAccountPerSale = BigNumber.from(0);
  },
};
