import { ethers } from "ethers";

import { AirWild2Sale, AirWild2Sale__factory } from "./types";
import { WapeSale, WapeSale__factory } from "./types";
import { ClaimWithChildSale } from "./types/ClaimWithChildSale";
import { ClaimWithChildSale__factory } from "./types/factories/ClaimWithChildSale__factory";
import { GenSale__factory } from "./types/factories/GenSale_factory";
import { IERC721EnumerableUpgradeable__factory } from "./types/factories/IERC721EnumerableUpgradeable__factory";
import { GenSale } from "./types/GenSale";
import { IERC721EnumerableUpgradeable } from "./types/IERC721EnumerableUpgradeable";

export * from "./types";

export const getAirWild2SaleContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<AirWild2Sale> => {
  const contract = AirWild2Sale__factory.connect(address, provider);
  return contract;
};

export const getWapeSaleContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<WapeSale> => {
  const contract = WapeSale__factory.connect(address, provider);
  return contract;
};

export const getGenSaleContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<GenSale> => {
  const contract = GenSale__factory.connect(address, provider);
  return contract;
};

export const getClaimContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<ClaimWithChildSale> => {
  const contract = ClaimWithChildSale__factory.connect(address, provider);
  return contract;
};

export const getClaimingToken = async (
  provider: ethers.providers.Provider,
  address: string
): Promise<IERC721EnumerableUpgradeable> => {
  const contract = IERC721EnumerableUpgradeable__factory.connect(
    address,
    provider
  );
  return contract;
};
