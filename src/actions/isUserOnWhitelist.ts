import { Claim, IPFSGatewayUri, Maybe, MerkleTree, Whitelist } from "../types";
import { getMerkleTree } from "./helpers";

export const isUserOnWhitelist = async (
  address: string,
  merkleFileUri: string, // ipfs://Qm...
  gateway: IPFSGatewayUri,
  cachedWhitelist: Maybe<Whitelist>
): Promise<boolean> => {
  if (cachedWhitelist)
    return cachedWhitelist.claims[address] ? true : false;

  const merkleTree: MerkleTree = await getMerkleTree(merkleFileUri, gateway);
  const isOnWhitelist = merkleTree.claims[address] ? true : false;

  return isOnWhitelist;
};
