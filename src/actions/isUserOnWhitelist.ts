import { getWhitelist } from ".";
import { IPFSGatewayUri } from "../types";

export const isUserOnWhitelist = async (
  address: string,
  merkleFileUri: string, // ipfs://Qm...
  gateway: IPFSGatewayUri
): Promise<boolean> => {
  const whitelist = await getWhitelist(merkleFileUri, gateway);
  const isOnWhitelist = whitelist.claims[address] ? true : false;

  return isOnWhitelist;
};
