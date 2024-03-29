import { fetch } from "cross-fetch";
import { WapeSaleConfig, Maybe, Mintlist } from "../../types";
import { getWapeSaleContract } from "../../contracts";

const extractIPFSHash = (hay: string) => {
  const regex = /(Qm.+)$/;
  const matches = regex.exec(hay);
  if (!matches) {
    return undefined;
  }
  return matches[1];
};

const defaultIpfsGateway = "https://ipfs.io/ipfs/";

export const getMintlist = async (config: WapeSaleConfig) => {
  let mintlist: Maybe<Mintlist>;

  const wapeSale = await getWapeSaleContract(
    config.web3Provider,
    config.contractAddress
  );

  // fetch via main uri
  try {
    const res = await fetch(config.merkleTreeFileUri, {
      method: "GET",
    });
    mintlist = (await res.json()) as Mintlist;
    return mintlist;
  } catch (e) {
    console.error(
      `Unable to fetch mint list via uri ${config.merkleTreeFileUri}`
    );
  }

  let ipfsHash: Maybe<string>;
  if (config.advanced?.merkleTreeFileIPFSHash) {
    ipfsHash = config.advanced.merkleTreeFileIPFSHash;
    if (!ipfsHash) {
      ipfsHash = extractIPFSHash(config.merkleTreeFileUri);
    }
  }

  // need an IPFS hash or we cant get via ipfs
  if (!ipfsHash) {
    console.error(`No IPFS Hash to fallback on.`);
    throw Error(`Unable to fetch mintlist via url.`);
  }

  let ipfsGateway = config.advanced?.ipfsGateway ?? defaultIpfsGateway;
  if (ipfsGateway[ipfsGateway.length - 1] !== "/") {
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
