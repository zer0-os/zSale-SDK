require("dotenv").config();
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { ethers } from "ethers";

import { createWapeSaleInstance } from "../src";
import {
  getWapeSaleContract,
  WapeSale,
} from "../src/contracts";
import {
  Claim,
  WapeSaleConfig,
  WapeSaleInstance,
  Maybe,
  SaleStatus,
} from "../src/types";

const expect = chai.expect;
chai.use(chaiAsPromised.default);
require("dotenv").config();

describe("Test Custom SDK Logic", () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env["INFURA_URL"],
    5
  );

  const pk = process.env.TESTNET_PRIVATE_KEY;
  if (!pk) throw Error("No private key");

  const signer = new ethers.Wallet(pk, provider);

  const voidSignerAddress = "0x8ba1f109551bD432803012645Ac136ddd64DBA72";
  const astroTest = "0x35888AD3f1C0b39244Bb54746B96Ee84A5d97a53";

  // From dApp Goerli zSale SDK Config
  const config: WapeSaleConfig = {
    web3Provider: provider,
    contractAddress: "0x42F0523f33A4C36d56e91FA7ce7407f36caf69A2",
    publicSalePurchaseLimit: 9,
    merkleTreeFileUri:
      "https://res.cloudinary.com/fact0ry/raw/upload/v1671045872/drops/wapes/merkle/modified-dry-run-mintlist-merkleTree.json",
    advanced: {
      merkleTreeFileIPFSHash: "Qmc9LFv4SvStGMg7KLDmyoqTzk1t6nMnpAcF5JpsUXkVPy",
    },
  };

  const abi = ["function masterCopy() external view returns (address)"];

  describe("e2e", () => {
    let sdk: WapeSaleInstance;
    before(async () => {
      sdk = createWapeSaleInstance(config);
    });
    it("Makes a purchase", async () => {
      // Modifies contract state, only uncomment to test through sdk manually
      const tx = await sdk.purchaseDomains(ethers.BigNumber.from("2"), signer);
      console.log(tx.hash)
      const receipt = await tx.wait(3);
    });
  });
  describe("SDK Tests", () => {
    let sdk: WapeSaleInstance;
    before(async () => {
      sdk = createWapeSaleInstance(config);
    });
    it("Can get the seller wallet implementation copy", async () => {
      const wapeSaleContract: WapeSale = await getWapeSaleContract(
        signer,
        config.contractAddress
      );
      const sellerWalletAddress = await wapeSaleContract.sellerWallet();

      const contract = new ethers.Contract(sellerWalletAddress, abi, provider);
      // If seller wallet is EOA, this will fail
      const implAddress = await contract.masterCopy();

      expect(implAddress).to.not.be.undefined;
    });
  });
  describe("Test the merkle tree behaviour", () => {
    let sdk: WapeSaleInstance;
    before(async () => {
      sdk = createWapeSaleInstance(config);
    });
    it("errors when address is not in merkle tree", async () => {
      const mintlist = await sdk.getMintlist();
      const userClaim: Maybe<Claim> = mintlist.claims[voidSignerAddress];
      expect(userClaim).to.equal(undefined);
    });
    it("returns the account information when address is in the merkle tree", async () => {
      const mintlist = await sdk.getMintlist();
      const userClaim: Maybe<Claim> = mintlist.claims[astroTest];
      expect(userClaim).to.not.be.undefined;
    });
  });
  describe("Get info from sale through SDK", () => {
    let sdk: WapeSaleInstance;
    before(async () => {
      sdk = createWapeSaleInstance(config);
    });
    it("getMintlist", async () => {
      const mintlist = await sdk.getMintlist();
      expect(mintlist).to.not.be.undefined;
    });
    it("getSaleData", async () => {
      const saleData = await sdk.getSaleData();
      expect(saleData).to.not.be.undefined;
    });
    it("getSaleStatus", async () => {
      const status = await sdk.getSaleStatus();
      expect(status).to.not.eq(SaleStatus.NotStarted);
    });
  });
});
