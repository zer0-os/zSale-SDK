import fetch from "cross-fetch";

import { IPFSGatewayUri } from "../../types";

export const ipfsToHttpUrl = (
  ipfsHash: string,
  ipfsGatewayUri: IPFSGatewayUri
) => {
  // Receive ipfs://Qm...

  const qmHash = ipfsHash.split("//")[1];
  const formattedUri = `https://${ipfsGatewayUri}/ipfs/${qmHash}`;
  return formattedUri;
};
