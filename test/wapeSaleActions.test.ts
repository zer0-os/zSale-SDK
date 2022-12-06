import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import { solidityKeccak256 } from "ethers/lib/utils";

import { createWapeSaleInstance } from "../src";
import * as wapeSaleActions from "../src/actions/wapeSale";
import {
  getAirWild2SaleContract,
  AirWild2Sale,
  getWapeSaleContract,
  WapeSale,
  WapeSale__factory,
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
dotenv.config();

describe("Test Custom SDK Logic", () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env["INFURA_URL"],
    5
  );

  const pk = process.env["TESTNET_PRIVATE_KEY"];
  if (!pk) throw Error("No private key");

  const signer = new ethers.Wallet(pk, provider);

  const voidSignerAddress = "0x8ba1f109551bD432803012645Ac136ddd64DBA72";
  const astroTest = "0x35888AD3f1C0b39244Bb54746B96Ee84A5d97a53";



  // From dApp Goerli zSale SDK Config
  const config: WapeSaleConfig = {
    web3Provider: provider,
    contractAddress: "0xFEeDBd2b5c3Ae26fD534275bA68908100B107AF3", // 12/5/22
    merkleTreeFileUri:
    "https://res.cloudinary.com/fact0ry/raw/upload/v1670283875/drops/wapes/wapes-dry-run-merkleTree.json",
      // "https://res.cloudinary.com/fact0ry/raw/upload/v1670283073/wape-sale-mintlist-merkleTree_urrz7o.json",
    advanced: {
      merkleTreeFileIPFSHash: "Qmf526r9ShRJp8hgfB64txgMMhop9JSy3QWgBhqq41ucVs",
    },
  };

  const abi = ["function masterCopy() external view returns (address)"];

  describe("e2e tests", () => {
    let sdk: WapeSaleInstance;
    before(async () => {
      sdk = createWapeSaleInstance(config);
    });
    it("real contract tests", async () => {
      const wapeSaleContract: WapeSale = await getWapeSaleContract(
        signer,
        config.contractAddress
      );
      const sellerWalletAddress = await wapeSaleContract.sellerWallet();

      // If using a testnet the seller wallet may be an EOA
      // and this will throw an error. For parity with mainnet, call a Gnosis safe
      let contract;
      let implAddress;
      try {
        contract = new ethers.Contract(sellerWalletAddress, abi, provider);
        
        implAddress = await contract.masterCopy();
        expect(implAddress).to.not.be.undefined;
      } catch (e) {
        const goerliGnosisSafeAddress = "0x7336eF6E88A994182853fFb1fd0A779b16d02945";
        contract = new ethers.Contract(goerliGnosisSafeAddress, abi, provider);
        implAddress = await contract.masterCopy();
        expect(implAddress).to.not.be.undefined;
      }
    });
    it("Makes a purchase with access list", async () => {
      const mintlist = await sdk.getMintlist();

      const wapeSale = await getWapeSaleContract(
        signer,
        config.contractAddress
      );
      const address = await signer.getAddress();

      const args = {
        count: ethers.BigNumber.from("1"),
        signer: signer,
        contract: wapeSale,
        mintlist: mintlist,
      };

      const claim = mintlist.claims[address];
      expect(claim?.quantity === 12);

      const purchased = await wapeSale.domainsPurchasedByAccount(address);

      // const tx = await sdk.purchaseDomains(args.count, args.signer);
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
  describe("Get sale data", () => {
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
  describe("getSaleData", () => {
    it("runs", async () => {
      const contract = await getWapeSaleContract(
        signer,
        config.contractAddress
      );
      const data = await wapeSaleActions.getSaleData(contract, true);
      expect(data);
    });
  });
});
