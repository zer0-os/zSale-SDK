import { ethers } from "ethers";

import {
  AirWild2Sale,
  AirWild2Sale__factory,
  WolfSale,
  WolfSale__factory,
} from "./types";

export * from "./types";

export const getWolfSaleContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<WolfSale> => {
  const contract = WolfSale__factory.connect(address, provider);
  return contract;
};

export const getAirWild2SaleContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<AirWild2Sale> => {
  const contract = AirWild2Sale__factory.connect(address, provider);
  return contract;
};
