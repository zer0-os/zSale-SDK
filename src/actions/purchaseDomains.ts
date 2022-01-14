import * as ethers from "ethers";
import { balanceOf, getSaleStatus, getWhiteListedUserClaim } from ".";
import { WhiteListSimpleSale } from "../contracts/types";
import { Claim, IPFSGatewayUri, Maybe, SaleStatus, Whitelist } from "../types";

export const purchaseDomains = async (
  count: ethers.BigNumber,
  signer: ethers.Signer,
  merkleFileUri: string,
  isEth: boolean,
  contract: WhiteListSimpleSale,
  cachedWhitelist: Maybe<Whitelist>,
  saleToken?: string
): Promise<ethers.ContractTransaction> => {
  const status = await getSaleStatus(contract);
  const price = await contract.salePrice();

  if (isEth) {
    const balance = await signer.getBalance();
    const userHasFunds = balance.gte(price);
    if (!userHasFunds)
      throw Error("User ETH balance is not enough to purchase a domain");
  } else {
    if (!saleToken)
      throw Error("If `isEth` is set to false a `saleToken` parameter is required");
    const balance = await balanceOf(saleToken, signer);
    const userHasFunds = balance.gte(price);
    if (!userHasFunds)
      throw Error("User token balance is not enough to purchase a domain");
  }

  // If sale hasn't started nobody can make a purchase yet
  if (status === SaleStatus.NotStarted)
    throw Error("Cannot call to purchaseDomains when sale has not begun");

  const address = await signer.getAddress();

  // If sale is in whitelist phase only addresses found on the whitelist can purchase
  if (status === SaleStatus.WhiteListOnly) {
    const userClaim: Claim | undefined = await getWhiteListedUserClaim(
      address,
      merkleFileUri,
      IPFSGatewayUri.fleek,
      cachedWhitelist
    );

    if (!userClaim) throw Error("User is not on the sale whitelist");

    const purchased = await contract.domainsPurchasedByAccount(address)
    const maxPurchase = await contract.maxPurchasesPerAccount();

    if ((purchased.add(ethers.BigNumber.from("1")).gt(maxPurchase)))
      throw Error("User is unable to make any more purchases, they have already reached the limit");

    const tx = await contract
      .connect(signer)
      .purchaseDomainsWhitelisted(count, userClaim.index, userClaim.proof);
    return tx;
  } else {
    // If sale is public, anyone is allowed to make a purchase
    const tx = await contract.connect(signer).purchaseDomains(count);
    return tx;
  }
};
