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

  errorCheck(count.eq("0"), "Cannot purchase 0 domains");

  const paused = await contract.paused();

  errorCheck(paused, "Sale contract is paused");

  // Track domains that have sold
  const domainsSold = await contract.domainsSold();
  const publicQuantity = await contract.publicSaleQuantity();
  const privateQuantity = await contract.privateSaleQuantity();

  // The public sale occurs after the private sale. There is only
  // one variable to track domains sold. To offset having just done
  // the private sale, we have to add that quantity here when checking.
  // e.g. It is the private sale, we sell 3000 domains, now the `domainsSold`
  // variable is 3000. We move to the public sale and we have 3000 more domains
  // to sell, but because the `domainsSold` variable is already 3000 this would
  // error unless we offset the quantity from the private sale as well. 
  errorCheck(
    domainsSold === (publicQuantity.add(privateQuantity)),
    "There are no domains left for purchase in the sale"
  )

  const address = await signer.getAddress();
  const balance = await signer.getBalance();
  const price = await contract.salePrice();

  errorCheck(
    balance.lt(price.mul(count)),
    `Not enough funds given for purchase of ${count} domains`
  );
  // There is no limit to purchases in the public sale
  if (SaleStatus.PublicSale) {
    const tx = await contract.purchaseDomainsPublicSale(count);
    return tx;
  }

  const purchased = await contract.domainsPurchasedByAccount(address);

  errorCheck(
    domainsSold === privateQuantity,
    "There are no domains left for purchase in the sale"
  )

  const mintlist = await getMintlist(merkleFileUri, IPFSGatewayUri.fleek, cachedMintlist);
  const userClaim: Claim = mintlist.claims[address];

  // To purchase in private sale a user must be on the mintlist
  errorCheck(userClaim === undefined, "User is not on the mintlist");

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
