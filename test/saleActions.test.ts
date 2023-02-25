import nock from "nock";
import { assert, expect } from "chai";
import { numberPurchasableByAccount } from "../src/actions/sale/numberPurchasableByAccount";
import { Mintlist, SaleConfiguration, SaleContractConfig } from "../src/types";
import { Sale } from "../src/contracts/types";
import { SalePhase } from "../src/types";
import "mocha";
import { BigNumber, CallOverrides, ethers } from "ethers";
import {
  defaultIpfsGateway,
  getMintlist,
} from "../src/actions/sale/getMintlist";
import { getSaleStatus } from "../src/actions/sale";
import { Block, BlockTag, Provider } from "@ethersproject/providers";

const feb23TsSeconds = 1677173138;
const feb24TsSeconds = 1677264314;

function getDefaultMockSaleConfiguration(): Promise<
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
  return {
    sellerWallet: "0x1234567890123456789012345678901234567890",
    parentDomainId: BigNumber.from(123),
    salePrice: BigNumber.from(456),
    privateSalePrice: BigNumber.from(789),
    mintlistSaleDuration: BigNumber.from(3600), // ~ 1hr (seconds)
    amountForSale: BigNumber.from(50),
    mintlistMerkleRoot: "0xabcdef1234567890abcdef1234567890abcdef12",
    startingMetadataIndex: BigNumber.from(1),
    folderGroupID: BigNumber.from(2),
    publicSaleLimit: BigNumber.from(10),
  } as any;
}

describe("Sale SDK tests", async () => {
  // current vars hold the state of the mock sale contract, allowing for modification during test, if not modified during tests the values will be these defaults
  let currentSaleConfiguration = await getDefaultMockSaleConfiguration();
  let currentSalePhase = SalePhase.Private;
  let currentDomainsSold = BigNumber.from(0);
  let currentSaleStartTimestamp = BigNumber.from(feb23TsSeconds); // ~2/23/2023
  let currentLatestBlock: Partial<Block> = { timestamp: feb24TsSeconds } // ~2/24/2023

  // Mock implementation of Sale contract
  const mockSale: Partial<Sale> = {
    provider: {
      async getBlock(): Promise<Block> {
        return Promise.resolve(currentLatestBlock as Block);
      },
    } as unknown as Provider,
    async salePhase(): Promise<number> {
      return currentSalePhase;
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
      return currentSaleConfiguration;
    },

    async domainsSold(): Promise<BigNumber> {
      return currentDomainsSold;
    },
    async saleStartBlockTimestamp(): Promise<BigNumber> {
      return currentSaleStartTimestamp;
    },
  };

  describe("numberPurchasableByAccount", async () => {
    beforeEach(async () => {
      // reset any modifications made to contract state
      currentSaleConfiguration = await getDefaultMockSaleConfiguration();
      currentSalePhase = SalePhase.Private;
      currentDomainsSold = BigNumber.from(0);
      currentSaleStartTimestamp = BigNumber.from(feb23TsSeconds); // ~2/23/2023
      currentLatestBlock = {timestamp: feb24TsSeconds}   // ~2/24/2023
    });

    it("returns 0 for users not in the mint list during private or ready phase", async () => {
      const mintlist: Mintlist = {
        merkleRoot: "0xabcd",
        claims: {
          "0x123456789abcdef": { quantity: 3, index: 0, proof: ["0x1234"] },
        },
      };
      const account = "0xb";
      const result = await numberPurchasableByAccount(
        mintlist,
        mockSale as Sale,
        account
      );
      expect(result).to.equal(0);
    });

    it("returns user claim quantity during a private or ready sale", async () => {
      const mintlist: Mintlist = {
        merkleRoot: "0xabcd",
        claims: {
          "0x123456789abcdef": { quantity: 3, index: 0, proof: ["0x1234"] },
        },
      };
      const account = "0x123456789abcdef";
      const result = await numberPurchasableByAccount(
        mintlist,
        mockSale as Sale,
        account
      );
      expect(result).to.equal(mintlist.claims["0x123456789abcdef"]?.quantity);
    });

    it("returns public sale purchase limit during a public sale", async () => {
      currentSalePhase = SalePhase.Public;
      const mintlist: Mintlist = {
        merkleRoot: "0xabcd",
        claims: {
          "0x123456789abcdef": { quantity: 3, index: 0, proof: ["0x1234"] },
        },
      };
      const account = "0x123456789abcdef";
      const result = await numberPurchasableByAccount(
        mintlist,
        mockSale as Sale,
        account
      );
      expect(result).to.equal(
        currentSaleConfiguration.publicSaleLimit.toNumber()
      );
    });

    it("returns 0 if sale phase is inactive", async () => {
      currentSalePhase = SalePhase.Inactive;
      const mintlist: Mintlist = {
        merkleRoot: "0xabcd",
        claims: {
          "0x123456789abcdef": { quantity: 3, index: 0, proof: ["0x1234"] },
        },
      };
      const account = "0x123456789abcdef";
      const result = await numberPurchasableByAccount(
        mintlist,
        mockSale as Sale,
        account
      );
      expect(result).to.equal(0);
    });
  });

  describe("getMintlist", () => {
    const mockMintlist: Mintlist = {
      merkleRoot: "0x123",
      claims: {},
    };

    afterEach(() => {
      nock.cleanAll();
    });

    it("should return the mintlist from the main uri", async () => {
      const config: SaleContractConfig = {
        contractAddress: "0xabc",
        merkleTreeFileUri: "https://example.com/mintlist",
        web3Provider: new ethers.providers.JsonRpcProvider(),
      };

      nock("https://example.com").get("/mintlist").reply(200, mockMintlist);

      const result = await getMintlist(config);
      expect(result).to.deep.equal(mockMintlist);
    });

    it("should return the mintlist from IPFS", async () => {
      const config: SaleContractConfig = {
        contractAddress: "0xabc",
        merkleTreeFileUri: "https://example.com/mintlist",
        web3Provider: new ethers.providers.JsonRpcProvider(),
        advanced: {
          merkleTreeFileIPFSHash: "QmHash",
          ipfsGateway: "https://ipfs.io/ipfs/",
        },
      };

      nock("https://example.com").get("/mintlist").reply(404, mockMintlist);

      nock("https://ipfs.io").get("/ipfs/QmHash").reply(200, mockMintlist);

      const result = await getMintlist(config);
      expect(result).to.deep.equal(mockMintlist);
    });
  });

  describe("getSaleStatus", () => {
    const mockSaleAsSale: Sale = mockSale as Sale; // Cast to Sale to access types

    it("should return the ReadyForNewSale phase if salePhase returns ReadyForNewSale", async () => {
      currentSalePhase = SalePhase.ReadyForNewSale;

      const saleStatus = await getSaleStatus(mockSaleAsSale);

      expect(saleStatus).to.equal(SalePhase.ReadyForNewSale);
    });

    it("should return the Inactive phase if salePhase returns Inactive", async () => {
      currentSalePhase = SalePhase.Inactive;

      const saleStatus = await getSaleStatus(mockSaleAsSale);

      expect(saleStatus).to.equal(SalePhase.Inactive);
    });

    it("should return the Private phase if the sale is still in the Private phase", async () => {
      currentSalePhase = SalePhase.Private;
      currentDomainsSold = BigNumber.from(0);
      currentSaleStartTimestamp = BigNumber.from(Math.floor(Date.now() / 1000));

      const saleStatus = await getSaleStatus(mockSaleAsSale);

      expect(saleStatus).to.equal(SalePhase.Private);
    });

    it("should return the Public phase if the sale is in or transitioning to the Public phase", async () => {
      currentSalePhase = SalePhase.Private;

      currentSaleStartTimestamp = BigNumber.from(feb23TsSeconds);
      currentLatestBlock = { timestamp: feb23TsSeconds + 2 } ; // current time is T start + 2
      let modifiedSaleConfiguration = await getDefaultMockSaleConfiguration();
      modifiedSaleConfiguration.mintlistSaleDuration = BigNumber.from(1); // duration of private phase is T start + 1
      currentSaleConfiguration = modifiedSaleConfiguration;

      const saleStatus = await getSaleStatus(mockSaleAsSale);

      expect(saleStatus).to.equal(SalePhase.Public);
    });

    it("should return the Inactive phase if the sale has sold out", async () => {
      currentSalePhase = SalePhase.Private;
      currentDomainsSold = BigNumber.from(50); // All domains sold
      currentSaleStartTimestamp = BigNumber.from(Math.floor(Date.now() / 1000));

      const saleStatus = await getSaleStatus(mockSaleAsSale);

      expect(saleStatus).to.equal(SalePhase.Inactive);
    });
  });
});