import * as chai from "chai";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import * as actions from "../src/actions";
import { getSaleData, getSaleStatus, getWhitelist, getWhiteListedUserClaim } from "../src/actions";
import { getWhiteListSaleContract } from "../src/contracts";
import { Claim, IPFSGatewayUri, SaleStatus } from "../src/types";

const expect = chai.expect;
dotenv.config();

describe("Test Custom SDK Logic", () => {
  // Kovan
  const whitelistSimpleSaleContractAddress = "0xa6A3321b743C31912263090275E24d8b1A50cFE8";
  const provider = new ethers.providers.JsonRpcProvider(process.env["INFURA_URL"]);
  const pk = process.env["PRIVATE_KEY"];
  if (!pk) throw Error("No private key");

  const signer = new ethers.Wallet(pk, provider);

  const voidSignerAddress = "0x8ba1f109551bD432803012645Ac136ddd64DBA72";
  const addressFromFile = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";

  // Sample merkle file
  const ipfsUrl = "ipfs://bafybeihy6gypowkcfwtsuvspbqah6chvtfjd3lz5xcjdvwnwyjdxh2bufa"
  const cachedWhitelist = undefined;

  describe("getWhitelistedUserClaim", () => {
    it("returns undefined when address is not in merkle tree", async () => {
      const acct: Claim | undefined = await actions.getWhiteListedUserClaim(
        voidSignerAddress,
        ipfsUrl,
        IPFSGatewayUri.fleek,
        cachedWhitelist
      );
      expect(acct).to.equal(undefined);
    });
    it("returns the account information when address is in the merkle tree", async () => {
      const acct: Claim | undefined = await actions.getWhiteListedUserClaim(
        addressFromFile,
        ipfsUrl,
        IPFSGatewayUri.fleek,
        cachedWhitelist
      );
      expect(acct);
    });
  });
  describe("getSaleStatus", () => {
    it("runs", async () => {
      const contract = await getWhiteListSaleContract(signer, whitelistSimpleSaleContractAddress)
      const status = await getSaleStatus(contract);
      expect(status).to.equal(SaleStatus.Public);
    });
  });
  describe("getWhitelist", () => {
    it("runs", async () => {
      const whitelist = await getWhitelist(ipfsUrl, IPFSGatewayUri.fleek, cachedWhitelist);
      expect(whitelist);
    });
  });
  describe("getSaleData", () => {
    it("runs", async () => {
      const contract = await getWhiteListSaleContract(signer, whitelistSimpleSaleContractAddress)
      const data = await actions.getSaleData(contract, true);
      expect(data);
    })
  })
});
