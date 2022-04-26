import { fetch } from "cross-fetch";
import { Config, Maybe, Mintlist } from "../types";
import { AirWild2Sale } from "../contracts/types";

const extractIPFSHash = (hay: string) => {
  const regex = /(Qm.+)$/;
  const matches = regex.exec(hay);
  if (!matches) {
    return undefined;
  }
  return matches[1];
};

const defaultIpfsGateway = "https://ipfs.io/ipfs/";

export const getMintlist = async (config: Config, contract?: AirWild2Sale) => {
  let mintlist: Maybe<Mintlist>;
  let merkleTreeIndex = 0;

  if (contract) {
    merkleTreeIndex = (await contract.currentMerkleRootIndex()).toNumber();
  }

  // fetch via main uri
  try {
    const res = await fetch(config.merkleTreeFileUris[merkleTreeIndex], {
      method: "GET",
    });
    mintlist = (await res.json()) as Mintlist;
    return mintlist;
  } catch (e) {
    console.error(
      `Unable to fetch mint list via uri ${config.merkleTreeFileUris}`
    );
  }

  let ipfsHash: Maybe<string> = config.advanced?.merkleTreeFileIPFSHash;
  if (!ipfsHash) {
    ipfsHash = extractIPFSHash(config.merkleTreeFileUris[merkleTreeIndex]);
  }

  // need an IPFS hash or we cant get via ipfs
  if (!ipfsHash) {
    console.error(`No IPFS Hash to fallback on.`);
    throw Error(`Unable to fetch mintlist via url.`);
  }

  let ipfsGateway = config.advanced?.ipfsGateway ?? defaultIpfsGateway;
  if (ipfsGateway[ipfsGateway.length - 1] != "/") {
    // check if user forgot to add a / at the end of the gateway
    ipfsGateway += "/";
  }

  // fetch via ipfs
  try {
    const ipfsUri = `${ipfsGateway}${ipfsHash}`;
    const res = await fetch(ipfsUri, { method: "GET" });
    mintlist = (await res.json()) as Mintlist;
    return mintlist;
  } catch (e) {
    console.error(e);
    throw Error(`Unable to fetch mintlist via IPFS.`);
  }
};
