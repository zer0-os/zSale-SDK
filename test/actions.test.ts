import * as chai from "chai";
import * as dotenv from "dotenv";
import { solidity } from "ethereum-waffle";

import * as actions from "../src/actions";

chai.use(solidity);

const expect = chai.expect;
dotenv.config();

describe("Test Custom SDK Logic", () => {
  const voidSignerAddress = "0x8ba1f109551bD432803012645Ac136ddd64DBA72";
  const addressFromFile = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";
  const sampleFilePath = "../../merkle/sampleMerkle.json";

  describe("getWhitelistedUser", () => {
    it("returns undefined when address is not in merkle tree", async () => {
      const acct = await actions.getWhitelistedUser(voidSignerAddress, sampleFilePath);
      expect(acct).to.equal(undefined);
    });
    it("returns the account information when address is in the merkle tree", async () => {
      const acct = await actions.getWhitelistedUser(addressFromFile, sampleFilePath);
      expect(acct);
    })
  });
});