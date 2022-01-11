import fetch from "cross-fetch";

import { Claim, IPFSGatewayUri, MerkleTree } from "../types";
import { ipfsToHttpUrl } from "./helpers";

export const getWhiteListedUserClaim = async (
  address: string,
  merkleFileUri: string, // ipfs://Qm...
  gateway: IPFSGatewayUri
): Promise<Claim | undefined> => {
  const uri = ipfsToHttpUrl(merkleFileUri, gateway);

  const res = await fetch(uri, { method: "GET" });

  const merkleTree: MerkleTree = await res.json();
  const userClaim: Claim = merkleTree.claims[address];

  // Will return undefined if user is not found in merkle tree
  return userClaim;
};
