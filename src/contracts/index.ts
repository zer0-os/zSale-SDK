import { ethers } from "ethers";

import { Sale, Sale__factory, WapeSale, WapeSale__factory } from "./types";
import { IERC721EnumerableUpgradeable__factory } from "./types/factories/IERC721EnumerableUpgradeable__factory";
import { IERC721EnumerableUpgradeable } from "./types/IERC721EnumerableUpgradeable";

export * from "./types";

export const getWapeSaleContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<WapeSale> => {
  const contract = WapeSale__factory.connect(address, provider);
  return contract;
};

export const getSaleContract = async (
  provider: ethers.providers.Provider | ethers.Signer,
  address: string
): Promise<Sale> => {
  const contract = Sale__factory.connect(address, provider);
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
