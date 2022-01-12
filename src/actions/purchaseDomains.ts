import * as ethers from "ethers";
import { getSaleStatus, getWhiteListedUserClaim } from ".";
import { WhiteListSimpleSale } from "../contracts/types";
import { Claim, IPFSGatewayUri, SaleStatus } from "../types";

export const purchaseDomains = async (
  count: ethers.BigNumber,
  signer: ethers.Signer,
  merkleFileUri: string,
  contract: WhiteListSimpleSale
): Promise<ethers.ContractTransaction> => {
  const status = await getSaleStatus(contract);

  // If sale hasn't started nobody can make a purchase yet
  if (status === SaleStatus.NotStarted)
    throw Error("Cannot call to purchaseDomains when sale has not begun");

  const address = await signer.getAddress();

  // If sale is in whitelist phase only addresses found on the whitelist can purchase
  if (status === SaleStatus.WhiteListOnly) {
    // `user` will be undefined if not found in whitelist
    const userClaim: Claim | undefined = await getWhiteListedUserClaim(
      address,
      merkleFileUri,
      IPFSGatewayUri.fleek
    );

    if (!userClaim) throw Error("User is not on the sale whitelist");

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
