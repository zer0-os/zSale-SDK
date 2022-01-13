import fetch from "cross-fetch";

import { Claim, IPFSGatewayUri, Maybe, MerkleTree, Whitelist } from "../types";
import { getMerkleTree } from "./helpers";

export const getWhiteListedUserClaim = async (
  address: string,
  merkleFileUri: string, // ipfs://Qm...
  gateway: IPFSGatewayUri,
  cachedWhitelist: Maybe<Whitelist>
): Promise<Claim | undefined> => {
  if (cachedWhitelist)
    return cachedWhitelist.claims[address];

  const merkleTree: MerkleTree = await getMerkleTree(merkleFileUri, gateway);
  const userClaim: Claim = merkleTree.claims[address];

  if (!userClaim) throw Error(`No claim could be found for user ${address}`)

  return userClaim;
};
