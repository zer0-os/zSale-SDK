import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised"
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import * as actions from "../src/actions";
import { getSaleStatus, getWhitelist } from "../src/actions";
import { getWhiteListSaleContract } from "../src/contracts";
import { Claim, IPFSGatewayUri, SaleStatus } from "../src/types";

const expect = chai.expect;
chai.use(chaiAsPromised.default);
dotenv.config();

describe("Test Custom SDK Logic", () => {
  // Kovan
  const whitelistSimpleSaleContractAddress =
    "0xa6A3321b743C31912263090275E24d8b1A50cFE8";
  const provider = new ethers.providers.JsonRpcProvider(
    process.env["INFURA_URL"]
  );
  const pk = process.env["PRIVATE_KEY"];
  if (!pk) throw Error("No private key");

  const signer = new ethers.Wallet(pk, provider);

  const voidSignerAddress = "0x8ba1f109551bD432803012645Ac136ddd64DBA72";
  const addressFromFile = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";

  // Sample merkle file
  const ipfsUrl =
    "ipfs://bafybeihy6gypowkcfwtsuvspbqah6chvtfjd3lz5xcjdvwnwyjdxh2bufa";

  describe("getWhitelistedUserClaim", () => {
    it("errors when address is not in merkle tree", async () => {
      const whitelist = await getWhitelist(ipfsUrl, IPFSGatewayUri.fleek, undefined);
      const userClaim: Claim = whitelist.claims[voidSignerAddress];
      expect(userClaim).to.equal(undefined);
    });
    it("returns the account information when address is in the merkle tree", async () => {
      const whitelist = await getWhitelist(ipfsUrl, IPFSGatewayUri.fleek, undefined);
      const userClaim: Claim = whitelist.claims[addressFromFile];
      expect(userClaim);
    });
  });
  describe("getSaleStatus", () => {
    it("runs", async () => {
      const contract = await getWhiteListSaleContract(
        signer,
        whitelistSimpleSaleContractAddress
      );
      const status = await getSaleStatus(contract);
      expect(status).to.equal(SaleStatus.Public);
    });
  });
  describe("getWhitelist", () => {
    it("runs", async () => {
      const whitelist = await getWhitelist(ipfsUrl, IPFSGatewayUri.fleek, undefined);
      expect(whitelist);
    });
  });
  describe("getSaleData", () => {
    it("runs", async () => {
      const contract = await getWhiteListSaleContract(
        signer,
        whitelistSimpleSaleContractAddress
      );
      const data = await actions.getSaleData(contract, true);
      expect(data);
    });
  });
});
