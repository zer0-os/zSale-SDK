import nock from "nock";
import { expect } from "chai";
import { numberPurchasableByAccount } from "../src/actions/sale/numberPurchasableByAccount";
import { Mintlist, SaleContractConfig } from "../src/types";
import { Sale } from "../src/contracts/types";
import { SalePhase } from "../src/types";
import "mocha";
import {
  BigNumber,
  ethers,
  Signer,
} from "ethers";
import { getMintlist } from "../src/actions/sale/getMintlist";
import {
  getSaleData,
  getSaleStatus,
  purchaseDomains,
} from "../src/actions/sale";
import { Block } from "@ethersproject/providers";
import { SalePhases } from "../src/constants";
import { mocks, feb23TsSeconds, feb24TsSeconds, getDefaultMockSaleConfiguration } from "./mocks"


describe("Sale SDK tests", async () => {

  beforeEach(async () => {
    mocks.reset();
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
        mocks.sale as Sale,
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
        mocks.sale as Sale,
        account
      );
      expect(result).to.equal(mintlist.claims["0x123456789abcdef"]?.quantity);
    });

    it("returns public sale purchase limit during a public sale", async () => {
      mocks.currentSalePhase = SalePhase.Public;
      const mintlist: Mintlist = {
        merkleRoot: "0xabcd",
        claims: {
          "0x123456789abcdef": { quantity: 3, index: 0, proof: ["0x1234"] },
        },
      };
      const account = "0x123456789abcdef";
      const result = await numberPurchasableByAccount(
        mintlist,
        mocks.sale as Sale,
        account
      );
      expect(result).to.equal(
        mocks.currentSaleConfiguration.publicSaleLimit.toNumber()
      );
    });

    it("returns 0 if sale phase is inactive", async () => {
      mocks.currentSalePhase = SalePhase.Inactive;
      const mintlist: Mintlist = {
        merkleRoot: "0xabcd",
        claims: {
          "0x123456789abcdef": { quantity: 3, index: 0, proof: ["0x1234"] },
        },
      };
      const account = "0x123456789abcdef";
      const result = await numberPurchasableByAccount(
        mintlist,
        mocks.sale as Sale,
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
    const mockSaleAsSale: Sale = mocks.sale as Sale; // Cast to Sale to access types

    it("should return the ReadyForNewSale phase if salePhase returns ReadyForNewSale", async () => {
      mocks.currentSalePhase = SalePhase.ReadyForNewSale;

      const saleStatus = await getSaleStatus(mockSaleAsSale);

      expect(saleStatus).to.equal(SalePhase.ReadyForNewSale);
    });

    it("should return the Inactive phase if salePhase returns Inactive", async () => {
      mocks.currentSalePhase = SalePhase.Inactive;

      const saleStatus = await getSaleStatus(mockSaleAsSale);

      expect(saleStatus).to.equal(SalePhase.Inactive);
    });

    it("should return the Private phase if the sale is still in the Private phase", async () => {
      mocks.currentSalePhase = SalePhase.Private;
      mocks.currentDomainsSold = BigNumber.from(0);
      mocks.currentSaleStartTimestamp = BigNumber.from(Math.floor(Date.now() / 1000));

      const saleStatus = await getSaleStatus(mockSaleAsSale);

      expect(saleStatus).to.equal(SalePhase.Private);
    });

    it("should return the Public phase if the sale is in or transitioning to the Public phase", async () => {
      mocks.currentSalePhase = SalePhase.Private;

      mocks.currentSaleStartTimestamp = BigNumber.from(feb23TsSeconds);
      mocks.currentLatestBlock = { timestamp: feb23TsSeconds + 2 }; // current time is T start + 2
      let modifiedSaleConfiguration = await getDefaultMockSaleConfiguration();
      modifiedSaleConfiguration.mintlistSaleDuration = BigNumber.from(1); // duration of private phase is T start + 1
      mocks.currentSaleConfiguration = modifiedSaleConfiguration;

      const saleStatus = await getSaleStatus(mockSaleAsSale);

      expect(saleStatus).to.equal(SalePhase.Public);
    });

    it("should return the Inactive phase if the sale has sold out", async () => {
      mocks.currentSalePhase = SalePhase.Private;
      mocks.currentDomainsSold = BigNumber.from(50); // All domains sold
      mocks.currentSaleStartTimestamp = BigNumber.from(Math.floor(Date.now() / 1000));

      const saleStatus = await getSaleStatus(mockSaleAsSale);

      expect(saleStatus).to.equal(SalePhase.Inactive);
    });
  });

  describe("getSaleData", async () => {
    it("should return the sale data correctly", async () => {
      const salePhase = SalePhase.Private;
      const saleId = "12345";
      const saleCounter = 1;
      const amountSold = 5;
      const saleStartTime = 1645694400;

      const saleConfigurationRaw = await getDefaultMockSaleConfiguration();

      mocks.currentSalePhase = salePhase;
      mocks.currentSaleConfiguration = saleConfigurationRaw;
      mocks.currentDomainsSold = BigNumber.from(amountSold);
      mocks.currentSaleStartTimestamp = BigNumber.from(saleStartTime);
      mocks.currentLatestBlock = { timestamp: feb24TsSeconds } as Partial<Block>;

      const saleData = await getSaleData(mocks.sale as Sale);

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

    const signer = mocks.signer as Signer;
    const mintlist = mockMintlist;

    it("should fail if the sale is not yet started", async () => {
      mocks.currentSalePhase = SalePhase.ReadyForNewSale;

      await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mocks.sale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith(
        "Cannot purchase domains: Sale prepared but not yet started"
      );
    });

    it("should fail if no sale is in progress", async () => {
      mocks.currentSalePhase = SalePhase.Inactive;

      await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mocks.sale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith("Cannot purchase domains: No sale in progress");
    });

    it("should fail if count is 0", async () => {
      await expect(
        purchaseDomains(
          BigNumber.from(0),
          signer,
          mocks.sale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith("Cannot purchase 0 domains");
    });

    it("should fail if sale contract is paused", async () => {
      mocks.currentPauseStatus = true;

      await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mocks.sale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith("Sale contract is paused");
    });

    it("should fail if all domains have been sold", async () => {
      mocks.currentDomainsSold = BigNumber.from(50);

      await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mocks.sale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith(
        "There are no domains left for purchase in the sale"
      );
    });

    it("should fail if user does not have enough funds for purchase request", async () => {
      mocks.currentSignerFunds = ethers.utils.parseEther(".5");
      await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mocks.sale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith(
        `Not enough funds given for purchase of ${1} domains`
      );
    });

    it("should fail if user tries to purchase more than domains remaining", async () => {
      mocks.currentDomainsPurchasedByAccountPerSale =
      mocks.currentSaleConfiguration.publicSaleLimit.sub(1);
      mocks.currentSignerFunds = ethers.utils.parseEther("4.0");
      const numToPurchase = BigNumber.from(2);

      await expect(
        purchaseDomains(
          numToPurchase,
          signer,
          mocks.sale as unknown as Sale,
          mintlist
        )
      ).to.be.rejectedWith(
        `This user has already purchased ${mocks.currentDomainsPurchasedByAccountPerSale.toString()} and buying ${numToPurchase.toString()} more domains would go over the 
        maximum purchase amount for the public sale limit of ${mocks.currentSaleConfiguration.publicSaleLimit.toString()}. Try reducing the purchase amount.`
      );
    });

    it("should succeed if user attempts a purchase that meets the criteria for the public phase", async () => {
      const purchaseDomainsResult = await expect(
        purchaseDomains(
          BigNumber.from(1),
          signer,
          mocks.sale as unknown as Sale,
          mintlist
        )
      ).to.eventually.equal("public");
    });
  });
});
