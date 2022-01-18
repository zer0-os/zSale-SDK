import fetch from "cross-fetch";
import { cachedDataVersionTag } from "v8";

import { IPFSGatewayUri, Maybe, Whitelist } from "../../types";


export const ipfsToHttpUrl = (
  ipfsHash: string,
  ipfsGatewayUri: IPFSGatewayUri
) => {
  // Receive ipfs://Qm...
  const qmHash = ipfsHash.split("//")[1];
  const formattedUri = `https://${ipfsGatewayUri}/ipfs/${qmHash}`;
  return formattedUri;
};

export const getMerkleTree = async (
  merkleFileUri: string,
  gateway: IPFSGatewayUri
): Promise<Whitelist> => {
  // Receive `ipfs://Qm...`
  const uri = ipfsToHttpUrl(merkleFileUri, gateway);
  const res = await fetch(uri, { method: "GET" });
  const merkleTree: Whitelist = await res.json();
  return merkleTree;
};

export const getWhitelist = async (
  merkleFileUri: string,
  gateway: IPFSGatewayUri,
  cachedWhitelist: Maybe<Whitelist>
) => {
  if (cachedWhitelist) {
    return cachedWhitelist;
  }
  
  const merkleTree: Whitelist = await getMerkleTree(merkleFileUri, gateway);
  
  cachedWhitelist = {
    merkleRoot: merkleTree.merkleRoot,
    claims: merkleTree.claims
  } as Whitelist;

  return {
    merkleRoot: merkleTree.merkleRoot,
    claims: merkleTree.claims
  } as Whitelist;
};
