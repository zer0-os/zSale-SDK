import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

import { MintlistSimpleFolderIndexSale, MintlistSimpleFolderIndexSale__factory } from "./types";

export const getMintlistFolderIndexSaleContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<MintlistSimpleFolderIndexSale> => {
  const contract = MintlistSimpleFolderIndexSale__factory.connect(address, provider);
  return contract;
};
