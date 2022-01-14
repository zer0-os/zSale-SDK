import {
  IPFSGatewayUri,
  Maybe,
  Whitelist
} from "../types"
import { getMerkleTree } from "./helpers";

export const getWhitelist = async (
  merkleFileUri: string,
  gateway: IPFSGatewayUri,
  cachedWhitelist: Maybe<Whitelist>
): Promise<Whitelist> => {
  if (cachedWhitelist)
    return cachedWhitelist;

  const merkleTree = await getMerkleTree(merkleFileUri, gateway);

  return {
    merkleRoot: merkleTree.merkleRoot,
    claims: merkleTree.claims
  } as Whitelist;
}
