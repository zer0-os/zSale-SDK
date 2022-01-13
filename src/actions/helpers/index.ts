import fetch from "cross-fetch";

import { IPFSGatewayUri, MerkleTree } from "../../types";

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
): Promise<MerkleTree> => {
  // Receive `ipfs://Qm...`
  const uri = ipfsToHttpUrl(merkleFileUri, gateway);
  const res = await fetch(uri, { method: "GET" });
  const merkleTree: MerkleTree = await res.json();
  return merkleTree;
}
