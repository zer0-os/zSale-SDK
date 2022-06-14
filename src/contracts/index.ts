import { ethers } from "ethers";

import { AirWild2Sale, AirWild2Sale__factory } from "./types";
import { ClaimWithChildSale } from "./types/ClaimWithChildSale";
import { ClaimWithChildSale__factory } from "./types/factories/ClaimWithChildSale__factory";

export * from "./types";

export const getAirWild2SaleContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<AirWild2Sale> => {
  const contract = AirWild2Sale__factory.connect(address, provider);
  return contract;
};

export const getClaimContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<ClaimWithChildSale> => {
  const contract = ClaimWithChildSale__factory.connect(address, provider);
  return contract;
};
