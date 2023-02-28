import nock from "nock";
import { expect } from "chai";
import { numberPurchasableByAccount } from "../src/actions/sale/numberPurchasableByAccount";
import { Mintlist, SaleContractConfig } from "../src/types";
import { Sale } from "../src/contracts/types";
import { SalePhase } from "../src/types";
import "mocha";
import {
  BigNumber,
  CallOverrides,
  ContractTransaction,
  ethers,
  Signer,
} from "ethers";
import { getMintlist } from "../src/actions/sale/getMintlist";
import {
  getSaleData,
  getSaleStatus,
  purchaseDomains,
} from "../src/actions/sale";
import { Block, BlockTag, Provider } from "@ethersproject/providers";
import { SalePhases } from "../src/constants";

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

describe("Sale SDK tests", async () => {
  // current vars hold the state of the mock sale contract, allowing for modification during test, if not modified during tests the values will be these defaults
  let currentSaleConfiguration = await getDefaultMockSaleConfiguration();
  let currentSalePhase = SalePhase.Private;
  let currentDomainsSold = BigNumber.from(0);
  let currentSaleStartTimestamp = BigNumber.from(feb23TsSeconds); // ~2/23/2023
  let currentLatestBlock: Partial<Block> = { timestamp: feb24TsSeconds }; // ~2/24/2023
  let currentSaleId = "12345";
  let currentSaleCounter = BigNumber.from(1);
  let currentPauseStatus = false;
  let currentSignerFunds = ethers.utils.parseEther("10.0");
  let currentDomainsPurchasedByAccountPerSale = BigNumber.from(0);

  const mockSigner: Partial<Signer> = {
    async getAddress(): Promise<string> {
      return Promise.resolve("0x1234567890123456789012345678901234567890");
    },
    async getBalance(): Promise<ethers.BigNumber> {
      return Promise.resolve(currentSignerFunds);
    },
  };

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
    async saleId(): Promise<BigNumber> {
      return BigNumber.from(currentSaleId);
    },
    async saleCounter(): Promise<BigNumber> {
      return currentSaleCounter;
    },
    async paused(): Promise<boolean> {
      return currentPauseStatus;
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
      return currentDomainsPurchasedByAccountPerSale;
    },
    async purchaseDomainsPublicSale(
      count: BigNumber,
      overrides: CallOverrides
    ): Promise<ContractTransaction> {
      return "public" as unknown as ContractTransaction;
    },

    connect(): any {
      return this;
    },
  };

  beforeEach(async () => {
    // reset any modifications made to contract state
    currentSaleConfiguration = await getDefaultMockSaleConfiguration();
    currentSalePhase = SalePhase.Private;
    currentDomainsSold = BigNumber.from(5);
    currentSaleStartTimestamp = BigNumber.from(feb23TsSeconds); // ~2/23/2023
    currentLatestBlock = { timestamp: feb24TsSeconds }; // ~2/24/2023
    currentSaleId = "12345";
    currentSaleCounter = BigNumber.from(1);
    currentPauseStatus = false;
    currentDomainsPurchasedByAccountPerSale = BigNumber.from(0);
  });

  describe("numberPurchasableByAccount", async () => {
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
      currentLatestBlock = { timestamp: feb23TsSeconds + 2 }; // current time is T start + 2
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

  describe("getSaleData", async () => {
    it("should return the sale data correctly", async () => {
      // TODO create defaults for the rest of these vars
      const salePhase = SalePhase.Private;
      const saleId = "12345";
      const saleCounter = 1;
      const amountSold = 5;
      const saleStartTime = 1645694400;

      const saleConfigurationRaw = await getDefaultMockSaleConfiguration();

      currentSalePhase = salePhase;
      currentSaleConfiguration = saleConfigurationRaw;
      currentDomainsSold = BigNumber.from(amountSold);
      currentSaleStartTimestamp = BigNumber.from(saleStartTime);
      currentLatestBlock = { timestamp: feb24TsSeconds } as Partial<Block>;

      const saleData = await getSaleData(mockSale as Sale);

      expect(saleData.saleId).to.equal(saleId);
      expect(saleData.salePhaseName).to.equal(SalePhases[salePhase]);
      expect(saleData.saleStartTimeSeconds).to.equal(saleStartTime);
      expect(saleData.saleCounter).to.equal(saleCounter);
      expect(saleData.salePhase).to.equal(salePhase);
      expect(saleData.saleConfiguration.amountSold.toNumber()).to.equal(
        amountSold
      );
      expect(saleData.saleConfiguration.sellerWallet).to.equal(
        saleConfigurationRaw.sellerWallet
      );
      expect(saleData.saleConfiguration.parentDomainId).to.equal(
        saleConfigurationRaw.parentDomainId.toHexString()
      );
      expect(saleData.saleConfiguration.publicSalePrice).to.equal(
        ethers.utils.formatEther(saleConfigurationRaw.salePrice)
      );
      expect(saleData.saleConfiguration.privateSalePrice).to.equal(
        ethers.utils.formatEther(saleConfigurationRaw.privateSalePrice)
      );
      expect(saleData.saleConfiguration.mintlistSaleDurationSeconds).to.equal(
        saleConfigurationRaw.mintlistSaleDuration.toNumber()
      );
      expect(saleData.saleConfiguration.amountForSale.toNumber()).to.equal(
        saleConfigurationRaw.amountForSale.toNumber()
      );
      expect(saleData.saleConfiguration.mintlistMerkleRoot).to.equal(
        saleConfigurationRaw.mintlistMerkleRoot
      );
      expect(
        saleData.saleConfiguration.startingMetadataIndex.toNumber()
      ).to.equal(saleConfigurationRaw.startingMetadataIndex.toNumber());
      expect(saleData.saleConfiguration.folderGroupID.toNumber()).to.equal(
        saleConfigurationRaw.folderGroupID.toNumber()
      );
      expect(saleData.saleConfiguration.publicSaleLimit.toNumber()).to.equal(
        saleConfigurationRaw.publicSaleLimit.toNumber()
      );
    });
  });

  describe("purchaseDomains", async () => {
    const mockMintlist: Mintlist = {
      merkleRoot:
        "0x1234567890123456789012345678901234567890123456789012345678901234",
      claims: {
        "0x1111111111111111111111111111111111111111": {
          index: 0,
          quantity: 10,
          proof: [
            "0x2222222222222222222222222222222222222222222222222222222222222222",
          ],
        },
      },
    };

    const signer = mockSigner as Signer;
    const mintlist = mockMintlist;

    it("should fail if the sale is not yet started", async () => {
      // Arrange
      currentSalePhase = SalePhase.ReadyForNewSale;

      // Act and assert
      await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mockSale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith(
        "Cannot purchase domains: Sale prepared but not yet started"
      );
    });

    it("should fail if no sale is in progress", async () => {
      // Arrange
      currentSalePhase = SalePhase.Inactive;

      // Act and assert
      await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mockSale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith("Cannot purchase domains: No sale in progress");
    });

    it("should fail if count is 0", async () => {
      // Act and assert
      await expect(
        purchaseDomains(
          BigNumber.from(0),
          signer,
          mockSale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith("Cannot purchase 0 domains");
    });

    it("should fail if sale contract is paused", async () => {
      // Arrange
      currentPauseStatus = true;

      // Act and assert
      await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mockSale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith("Sale contract is paused");
    });

    it("should fail if all domains have been sold", async () => {
      // Arrange
      currentDomainsSold = BigNumber.from(50);

      // Act and assert
      await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mockSale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith(
        "There are no domains left for purchase in the sale"
      );
    });

    it("should fail if user does not have enough funds for purchase request", async () => {
      currentSignerFunds = ethers.utils.parseEther(".5");
      await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mockSale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith(
        `Not enough funds given for purchase of ${1} domains`
      );
    });

    it("should fail if user tries to purchase more than domains remaining", async () => {
      currentDomainsPurchasedByAccountPerSale =
        currentSaleConfiguration.publicSaleLimit.sub(1);
      currentSignerFunds = ethers.utils.parseEther("4.0");
      const numToPurchase = BigNumber.from(2);

      await expect(
        purchaseDomains(
          numToPurchase,
          signer,
          mockSale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith(
        `This user has already purchased ${currentDomainsPurchasedByAccountPerSale.toString()} and buying ${numToPurchase.toString()} more domains would go over the 
        maximum purchase amount for the public sale limit of ${currentSaleConfiguration.publicSaleLimit.toString()}. Try reducing the purchase amount.`
      );
    });

    it("should succeed if user attempts a purchase that meets the criteria for the public phase", async () => {
      const purchaseDomainsResult =  await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mockSale as unknown as Sale,
          mintlist
        )
      ).to.eventually.equal("public");
    })
  });
});
