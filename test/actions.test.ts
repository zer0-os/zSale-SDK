import * as chai from "chai";
import * as dotenv from "dotenv";

import * as actions from "../src/actions";
import { Claim, IPFSGatewayUri } from "../src/types";

const expect = chai.expect;
dotenv.config();

describe("Test Custom SDK Logic", () => {
  const voidSignerAddress = "0x8ba1f109551bD432803012645Ac136ddd64DBA72";
  const addressFromFile = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";

  // Sample merkle file
  const ipfsUrl = "ipfs://bafybeihy6gypowkcfwtsuvspbqah6chvtfjd3lz5xcjdvwnwyjdxh2bufa"

  describe("getWhitelistedUser", () => {
    it("returns undefined when address is not in merkle tree", async () => {
      const acct: Claim | undefined = await actions.getWhiteListedUserClaim(
        voidSignerAddress,
        ipfsUrl,
        IPFSGatewayUri.fleek
      );
      expect(acct).to.equal(undefined);
    });
    it("returns the account information when address is in the merkle tree", async () => {
      const acct: Claim | undefined = await actions.getWhiteListedUserClaim(
        addressFromFile,
        ipfsUrl,
        IPFSGatewayUri.fleek
      );
      expect(acct);
    });
  });
});
