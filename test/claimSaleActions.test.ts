import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { createClaimWithChildInstance } from "../src";
import * as claimActions from "../src/actions/claimWithChildSale";
import { getClaimContract } from "../src/contracts";
import { ClaimWithChildSale } from "../src/contracts/types/ClaimWithChildSale";
import { SaleStatus, ClaimSaleConfig } from "../src/types";

const expect = chai.expect;
chai.use(chaiAsPromised.default);
dotenv.config();

describe("Test Claim Logic", () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env["INFURA_URL"],
    4
  );

  const pk = process.env["ASTRO_PRIVATE_KEY"];
  if (!pk) throw Error("No private key");

  const signer = new ethers.Wallet(pk, provider);

  // From dApp Rinkeby zSale SDK Config
  const config: ClaimSaleConfig = {
    web3Provider: provider,
    contractAddress: "0x0cDa74723A9945977df45268394DFf7989E0265b",
  };

  const abi = ["function masterCopy() external view returns (address)"];

  describe("e2e claim", () => {
    it("real contract tests", async () => {
      const claimSale: ClaimWithChildSale = await getClaimContract(
        signer,
        config.contractAddress
      );
      const sellerWalletAddress = await claimSale.sellerWallet();

      const contract = new ethers.Contract(sellerWalletAddress, abi, provider);

      const implAddress = await contract.masterCopy();
      expect(implAddress);
    });
    describe("Claim Sale", () => {
      describe("getSaleStatus", () => {
        it("runs", async () => {
          const contract = await getClaimContract(
            signer,
            config.contractAddress
          );
          const status = await claimActions.getSaleStatus(contract);
          expect(status).to.equal(SaleStatus.NotStarted);
        });
      });
      describe("getSaleData", () => {
        it("runs", async () => {
          const contract = await getClaimContract(
            signer,
            config.contractAddress
          );
          const data = await claimActions.getSaleData(contract, true);
          expect(data);
          expect(data.amountForSale == 1000);
          expect(data.amountSold == 0);
          expect(data.started == false);
          expect(data.saleDuration == 136416);
          expect(data.paused == false);
        });
      });
    });
  });
});
