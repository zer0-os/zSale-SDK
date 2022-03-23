import fetch from "cross-fetch";

import { IPFSGatewayUri, Maybe, Mintlist } from "../../types";


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
): Promise<Mintlist> => {
  // Receive `ipfs://Qm...`
  const uri = ipfsToHttpUrl(merkleFileUri, gateway);
  const res = await fetch(uri, { method: "GET" });
  const merkleTree: Mintlist = await res.json();
  return merkleTree;
};

export const getMintlist = async (
  merkleFileUri: string,
  gateway: IPFSGatewayUri,
  cachedWhitelist: Maybe<Mintlist>
) => {
  if (cachedWhitelist) {
    return cachedWhitelist;
  }
  
  const merkleTree: Mintlist = await getMerkleTree(merkleFileUri, gateway);
  
  cachedWhitelist = {
    merkleRoot: merkleTree.merkleRoot,
    claims: merkleTree.claims
  } as Mintlist;

  return {
    merkleRoot: merkleTree.merkleRoot,
    claims: merkleTree.claims
  } as Mintlist;
};
