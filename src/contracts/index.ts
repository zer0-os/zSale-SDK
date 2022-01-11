import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

import {
  WhiteListSimpleSale,
  WhiteListSimpleSale__factory
} from "./types";

export const getWhiteListSaleContract = async (
  web3Provider: ethers.providers.Web3Provider | ethers.Signer,
  address: string
): Promise<WhiteListSimpleSale> => {
  const contract = WhiteListSimpleSale__factory.connect(address, web3Provider);
  return contract;
}
