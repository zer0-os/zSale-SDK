import { Claim, IPFSGatewayUri, Maybe, Whitelist } from "../types";
import { getWhitelist } from "./helpers";

export const getWhiteListedUserClaim = async (
  address: string,
  merkleFileUri: string, // ipfs://Qm...
  gateway: IPFSGatewayUri
): Promise<Claim> => {
  const whitelist = await getWhitelist(merkleFileUri, gateway);

  const userClaim: Claim = whitelist.claims[address];

  if (!userClaim) {
    throw Error(`No claim could be found for user ${address}`);
  }

  return userClaim;
};
