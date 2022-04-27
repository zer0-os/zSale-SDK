import { fetch } from "cross-fetch";
import { Config, Maybe, Mintlist } from "../types";
import { getAirWild2SaleContract } from "../contracts";
import { ethers } from "ethers";

const extractIPFSHash = (hay: string) => {
  const regex = /(Qm.+)$/;
  const matches = regex.exec(hay);
  if (!matches) {
    return undefined;
  }
  return matches[1];
};

const defaultIpfsGateway = "https://ipfs.io/ipfs/";

export const getMintlist = async (config: Config) => {
  let mintlist: Maybe<Mintlist>;
  let merkleTreeIndex = 0;

  const airWild2Sale = await getAirWild2SaleContract(
    new ethers.VoidSigner(""),
    config.contractAddress
  ); // Since we'll only be reading here we actually don't need a signer

  if (airWild2Sale) {
    merkleTreeIndex = (await airWild2Sale.currentMerkleRootIndex()).toNumber();
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

  let ipfsHash: Maybe<string>;
  if (config.advanced?.merkleTreeFileIPFSHashes) {
    ipfsHash = config.advanced.merkleTreeFileIPFSHashes[merkleTreeIndex];
    if (!ipfsHash) {
      ipfsHash = extractIPFSHash(config.merkleTreeFileUris[merkleTreeIndex]);
    }
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
