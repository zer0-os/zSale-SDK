import * as ethers from "ethers";
import { getSaleStatus } from ".";
import { MintlistSimpleFolderIndexSale } from "../contracts/types";
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
  contract: MintlistSimpleFolderIndexSale,
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
  errorCheck(
    status === SaleStatus.Ended,
    "Cannot purchase a domain once the sale has ended"
  );
  errorCheck(count.eq("0"), "Cannot purchase 0 domains");

  const paused = await contract.paused();

  errorCheck(paused, "Sale contract is paused");

  const domainsSold = await contract.domainsSold();
  const totalForSale = await contract.totalForSale();

  errorCheck(
    domainsSold == totalForSale,
    "There are no more domains left in the sale"
  );

  const address = await signer.getAddress();
  const mintlist = await getMintlist(merkleFileUri, IPFSGatewayUri.fleek, cachedMintlist);
  const userClaim: Claim = mintlist.claims[address];

  errorCheck(userClaim === undefined, "User is not on the mintlist");

  const purchased = await contract.domainsPurchasedByAccount(address);

  errorCheck(
    purchased.add(count).gte(userClaim.quantity),
    `Buying ${count} more domains would go over the maximum purchase amount of domains
    for this user. Try reducing the purchase amount.`
  );

  const price = await contract.salePrice();
  const balance = await signer.getBalance();

  errorCheck(
    balance.lt(price.mul(count)),
    `Not enough funds given for purchase of ${count} domains`
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
