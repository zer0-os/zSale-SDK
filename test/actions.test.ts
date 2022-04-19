import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised"
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import { createInstance } from "../src";

import * as actions from "../src/actions";
import { getSaleStatus, getMintlist } from "../src/actions";
import { getWolfSaleContract, WolfSale } from "../src/contracts";
import { Claim, Config, Instance, Maybe, Mintlist, SaleStatus } from "../src/types";

const expect = chai.expect;
chai.use(chaiAsPromised.default);
dotenv.config();

describe("Test Custom SDK Logic", () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env["INFURA_URL"],
    4
  );

  const pk = process.env["ASTRO_PRIVATE_KEY"];
  if (!pk) throw Error("No private key");

  const signer = new ethers.Wallet(pk, provider);

  const voidSignerAddress = "0x8ba1f109551bD432803012645Ac136ddd64DBA72";
  const astroTest = "0x35888AD3f1C0b39244Bb54746B96Ee84A5d97a53";

  // Sample merkle file
  const ipfsUrl =
    "ipfs://bafybeihy6gypowkcfwtsuvspbqah6chvtfjd3lz5xcjdvwnwyjdxh2bufa";

  // From dApp Rinkeby zSale SDK Config
  const config: Config = {
    web3Provider: provider,
    contractAddress: "0xC82E9E9B1e28F10a4C13a915a0BDCD4Db00d086d",
    // Using Rinkeby not Kovan, but can use same file for tests
    merkleTreeFileUri: 'https://d3810nvssqir6b.cloudfront.net/kovan-test-merkleTree.json',
    advanced: {
      merkleTreeFileIPFSHash:
        'Qmf8XuYT181zdvhNXSeYUhkptgezzK8QJnrAD16GGj8TrV',
    },
  }

  describe("e2e purchase", () => {
    it("runs with access list", async () => {
      const sdk: Instance = createInstance(config);
      const mintlist = await sdk.getMintlist()

      const wolfSale = await getWolfSaleContract(signer, config.contractAddress)
      const address = await signer.getAddress()

      const args = {
        count: ethers.BigNumber.from("1"),
        signer: signer,
        contract: wolfSale,
        mintlist: mintlist
      }

      const claim = mintlist.claims[address];

      const purchased = await wolfSale.domainsPurchasedByAccount(address)

      const tx = await sdk.purchaseDomains(
        args.count,
        args.signer,
        args.contract,
        args.mintlist
      );

      const receipt = await tx.wait(1);
    })
  })
  describe("getMintlistedUserClaim", () => {
    it("errors when address is not in merkle tree", async () => {
      const mintlist = await getMintlist(config);
      const userClaim: Maybe<Claim> = mintlist.claims[voidSignerAddress];
      expect(userClaim).to.equal(undefined);
    });
    it("returns the account information when address is in the merkle tree", async () => {
      const mintlist = await getMintlist(config);
      const userClaim: Maybe<Claim> = mintlist.claims[astroTest];
      expect(userClaim);
    });
  });
  describe("getSaleStatus", () => {
    it("runs", async () => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );
      const status = await getSaleStatus(contract);
      expect(status).to.equal(SaleStatus.PublicSale);
    });
  });
  describe("getMintlist", () => {
    it("runs", async () => {
      const whitelist = await getMintlist(config);
      expect(whitelist);
    });
  });
  describe("getSaleData", () => {
    it("runs", async () => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );
      const data = await actions.getSaleData(contract, true);
      expect(data);
    });
  });
});
