import nock from "nock";
import { assert, expect } from "chai";
import { numberPurchasableByAccount } from "../src/actions/sale/numberPurchasableByAccount";
import { Mintlist, SaleConfiguration, SaleContractConfig } from "../src/types";
import { Sale } from "../src/contracts/types";
import { SalePhase } from "../src/types";
import "mocha";
import { BigNumber, CallOverrides, ethers } from "ethers";
import { defaultIpfsGateway, getMintlist } from "../src/actions/sale/getMintlist";

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
    mintlistSaleDuration: BigNumber.from(100),
    amountForSale: BigNumber.from(50),
    mintlistMerkleRoot: "0xabcdef1234567890abcdef1234567890abcdef12",
    startingMetadataIndex: BigNumber.from(1),
    folderGroupID: BigNumber.from(2),
    publicSaleLimit: BigNumber.from(10),
  } as any;
}

describe("Sale SDK tests", async () => {
  // current vars hold the state of the mock sale contract, allowing for modification during test
  let currentSaleConfiguration = await getDefaultMockSaleConfiguration();
  let currentSalePhase = SalePhase.Private;

  // Mock implementation of Sale contract
  const mockSale: Partial<Sale> = {
    async salePhase() {
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
  };

  describe("numberPurchasableByAccount", async () => {
    beforeEach(async () => {
      // reset any modifications made to contract state to defaults
      currentSaleConfiguration = await getDefaultMockSaleConfiguration();
      currentSalePhase = SalePhase.Private;
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

  describe('getMintlist', () => {
    const mockMintlist: Mintlist = {
      merkleRoot: '0x123',
      claims: {},
    };
    
    beforeEach(() => {
      nock('https://example.com')
        .get('/mintlist')
        .reply(200, mockMintlist);
  
      nock('https://ipfs.io')
        .get('/ipfs/QmHash')
        .reply(200, mockMintlist);
    });
  
    afterEach(() => {
      nock.cleanAll();
    });
  
    it('should return the mintlist from the main uri', async () => {
      const config: SaleContractConfig = {
        contractAddress: '0xabc',
        merkleTreeFileUri: 'https://example.com/mintlist',
        web3Provider: new ethers.providers.JsonRpcProvider(),
      };
  
      const result = await getMintlist(config);
      expect(result).to.deep.equal(mockMintlist);
    });
  
    it('should return the mintlist from IPFS', async () => {
      const config: SaleContractConfig = {
        contractAddress: '0xabc',
        merkleTreeFileUri: 'https://example.com/mintlist',
        web3Provider: new ethers.providers.JsonRpcProvider(),
        advanced: {
          merkleTreeFileIPFSHash: 'QmHash',
          ipfsGateway: 'https://ipfs.io/ipfs/',
        },
      };
  
      const result = await getMintlist(config);
      expect(result).to.deep.equal(mockMintlist);
    });
  });
  
});
