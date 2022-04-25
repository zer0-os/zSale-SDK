import { ethers } from "ethers";

import { WolfSale, WolfSale__factory } from "./types";

export * from "./types"

export const getWolfSaleContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<WolfSale> => {
  const contract = WolfSale__factory.connect(address, provider);
  return contract;
};
