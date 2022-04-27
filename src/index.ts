import { ethers } from "ethers";

import { getAirWild2SaleContract } from "./contracts";
import * as actions from "./actions";
import {
  Claim,
  Config,
  Instance,
  Maybe,
  SaleData,
  SaleStatus,
  Mintlist,
} from "./types";

export * from "./types";

const defaultPublicSalePurchaseLimit = 100;

export const createInstance = (config: Config): Instance => {
  let cachedMintlist: Maybe<Mintlist>;

  const getMintlist = async () => {
    if (cachedMintlist) {
      return cachedMintlist;
    }
    const mintlist = await actions.getMintlist(config);
    cachedMintlist = mintlist;

    return mintlist;
  };

  const instance: Instance = {
    getSalePrice: async (): Promise<string> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const price = await contract.salePrice();
      return ethers.utils.formatEther(price).toString();
    },
    getSaleData: async (): Promise<SaleData> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );

      // always eth sales currently
      const saleData: SaleData = await actions.getSaleData(contract, true);
      return saleData;
    },
    getSaleStartBlock: async (): Promise<string> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const startBlock = await contract.saleStartBlock();
      return startBlock.toString();
    },
    getSaleStatus: async (): Promise<SaleStatus> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const status: SaleStatus = await actions.getSaleStatus(contract);
      return status;
    },
    getMintlist: async (): Promise<Mintlist> => {
      const whitelist = await getMintlist();
      return whitelist;
    },
    getMintlistedUserClaim: async (address: string): Promise<Claim> => {
      const mintlist = await getMintlist();
      const userClaim: Maybe<Claim> = mintlist.claims[address];
      if (!userClaim) {
        throw Error(
          `No claim could be found for user ${address} because they are not on the whitelist`
        );
      }
      return userClaim;
    },
    getSaleMintlistDuration: async (): Promise<ethers.BigNumber> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const duration = await contract.mintlistDurations(
        await contract.currentMerkleRootIndex()
      );
      return duration;
    },
    getTotalForSale: async (): Promise<ethers.BigNumber> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const total = await contract.totalForSale();

      return total;
    },
    getNumberOfDomainsSold: async (): Promise<ethers.BigNumber> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const domainsSold = await contract.domainsSold();
      return domainsSold;
    },
    getBlockNumber: async (): Promise<number> => {
      const blockNum = await config.web3Provider.getBlockNumber();
      return blockNum;
    },
    getEthBalance: async (address: string): Promise<string> => {
      const balance = await config.web3Provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    },
    isUserOnMintlist: async (address: string): Promise<boolean> => {
      const mintlist = await getMintlist();
      const isOnWhitelist = mintlist.claims[address] ? true : false;
      return isOnWhitelist;
    },
    getDomainsPurchasedByAccount: async (address: string): Promise<number> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const domains = await contract.domainsPurchasedByAccount(address);
      return domains.toNumber();
    },
    purchaseDomains: async (
      count: ethers.BigNumber,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getAirWild2SaleContract(
        signer,
        config.contractAddress
      );

      const mintlist = await getMintlist();

      const tx = await actions.purchaseDomains(
        count,
        signer,
        contract,
        mintlist
      );
      return tx;
    },
    setPauseStatus: async (
      pauseStatus: boolean,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getAirWild2SaleContract(
        signer,
        config.contractAddress
      );
      const tx = await actions.setPauseStatus(pauseStatus, contract, signer);
      return tx;
    },
    numberPurchasableByAccount: async (address: string): Promise<number> => {
      const mintlist = await getMintlist();
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );

      const amount = await actions.numberPurchasableByAccount(
        mintlist,
        contract,
        address,
        config.publicSalePurchaseLimit ?? defaultPublicSalePurchaseLimit
      );

      return amount;
    },
  };

  return instance;
};
