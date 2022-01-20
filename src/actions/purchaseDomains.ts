import * as ethers from "ethers";
import { balanceOf, getSaleStatus } from ".";
import { WhiteListSimpleSale } from "../contracts/types";
import { Claim, IPFSGatewayUri, Maybe, SaleStatus, Whitelist } from "../types";

export const purchaseDomains = async (
  count: ethers.BigNumber,
  signer: ethers.Signer,
  merkleFileUri: string,
  isEth: boolean,
  contract: WhiteListSimpleSale,
  getWhitelist: (
    merkleFileUri: string,
    gateway: IPFSGatewayUri
  ) => Promise<Whitelist>,
  saleToken?: string
): Promise<ethers.ContractTransaction> => {
  const status = await getSaleStatus(contract);
  const price = await contract.salePrice();

  let txParams;

  // When a sale is created, a user has the option to set the sale token if they want to
  // If this is not set, then the sale token is Ethereum.
  if (isEth) {
    const balance = await signer.getBalance();
    const userHasFunds = balance.gte(price.mul(count));
    if (!userHasFunds) {
      throw Error("Not enough ETH to purchase a domain");
    }
    txParams = {
      value: price.mul(count)
    }
  } else {
    if (!saleToken) {
      throw Error(
        "SDK Configuration Error: SDK Config is set to do sale with ERC20 tokens but smart contract does not support it"
      );
      txParams = {};
    }
    const address = await signer.getAddress();
    const balance = await balanceOf(saleToken, address, signer);
    const userHasFunds = balance.gte(price);
    if (!userHasFunds) {
      throw Error("Not enough of sale token to purchase a domain");
    }
  }

  // If sale hasn't started nobody can make a purchase yet
  if (status === SaleStatus.NotStarted) {
    throw Error("Cannot call to purchaseDomains when sale has not begun");
  }

  const address = await signer.getAddress();

  // If sale is in whitelist phase only addresses found on the whitelist can purchase
  if (status === SaleStatus.WhiteListOnly) {
    const whitelist = await getWhitelist(merkleFileUri, IPFSGatewayUri.fleek);
    const userClaim: Claim = whitelist.claims[address];

    if (!userClaim) {
      throw Error("User is not on the sale whitelist");
    }

    const purchased = await contract.domainsPurchasedByAccount(address);
    const maxPurchase = await contract.maxPurchasesPerAccount();

    if (purchased.add(count).gt(maxPurchase)) {
      throw Error(
        `Buying ${count} more domains would go over the maximum purchase amount of domains per account.
        Try reducing the purchase amount.`
      );
    }

    const tx = await contract
      .connect(signer)
      .purchaseDomainsWhitelisted(count, userClaim.index, userClaim.proof, txParams);
    return tx;
  } else {
    // If sale is public, anyone is allowed to make a purchase
    const tx = await contract.connect(signer).purchaseDomains(count, txParams);
    return tx;
  }
};
