import { CloudflareProvider } from "@ethersproject/providers";
import * as ethers from "ethers";
import { getSaleStatus } from ".";
import { WolfSale } from "../contracts/types";
import { Claim, IPFSGatewayUri, SaleStatus, Mintlist, Maybe } from "../types";

export const errorCheck = async (condition: boolean, errorMessage: string) => {
  if (condition) {
    throw errorMessage;
  }
};

export const purchaseDomains = async (
  count: ethers.BigNumber,
  signer: ethers.Signer,
  merkleFileUri: string,
  contract: WolfSale,
  cachedMintlist: Maybe<Mintlist>,
  getMintlist: (
    merkleFileUri: string,
    gateway: IPFSGatewayUri,
    cachedMintlist: Maybe<Mintlist>
  ) => Promise<Mintlist>
): Promise<ethers.ContractTransaction> => {
  const status = await getSaleStatus(contract);

  errorCheck(
    status === SaleStatus.NotStarted,
    "Cannot purchase a domain when sale has not started or has ended"
  );

  errorCheck(status === SaleStatus.Ended, "Sale has already ended");

  errorCheck(count.eq("0"), "Cannot purchase 0 domains");

  const paused = await contract.paused();
  errorCheck(paused, "Sale contract is paused");

  const domainsSold = await contract.domainsSold();
  const numberForSale = await contract.numberForSaleForCurrentPhase();

  errorCheck(
    domainsSold.gte(numberForSale),
    "There are no domains left for purchase in the sale"
  );

  const address = await signer.getAddress();
  const balance = await signer.getBalance();
  const price = await contract.salePrice();

  errorCheck(
    balance.lt(price.mul(count)),
    `Not enough funds given for purchase of ${count} domains`
  );

  if (SaleStatus.PublicSale) {
    const tx = await contract.purchaseDomainsPublicSale(count);
    return tx;
  }

  const purchased = await contract.domainsPurchasedByAccount(address);

  const mintlist = await getMintlist(
    merkleFileUri,
    IPFSGatewayUri.fleek,
    cachedMintlist
  );
  const userClaim: Claim = mintlist.claims[address];

  // To purchase in private sale a user must be on the mintlist
  errorCheck(userClaim === undefined, "User is not part of private sale");

  // Sale is in private sale
  errorCheck(
    purchased.add(count).gte(userClaim.quantity),
    `Buying ${count} more domains would go over the maximum purchase amount of domains
    for this user. Try reducing the purchase amount.`
  );

  const tx = await contract
    .connect(signer)
    .purchaseDomains(
      count,
      userClaim.index,
      userClaim.quantity,
      userClaim.proof,
      {
        value: price.mul(count),
      }
    );
  return tx;
};
