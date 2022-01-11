import * as fs from "fs";
import * as path from "path";

import { Claim, MerkleTree } from "../types";

export const getWhitelistedUser = async (
  address: string,
  merkleFilePath: string
): Promise<Claim | undefined> => {
  const handle = fs.readFileSync(path.join(__dirname, merkleFilePath), "utf-8");
  const merkleTree: MerkleTree = JSON.parse(handle);

  const userClaim: Claim = merkleTree.claims[address];

  // Will return undefined if user is not found in merkle tree
  return userClaim;
};
