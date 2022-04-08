import { ethers } from "ethers";

import { getWolfSaleContract } from "./contracts";
import * as actions from "./actions";
import {
  Claim,
  Config,
  Instance,
  IPFSGatewayUri,
  Maybe,
  SaleData,
  SaleStatus,
  Mintlist,
} from "./types";

export const createInstance = (config: Config): Instance => {
  let cachedMintlist: Maybe<Mintlist>;

  const getMintlist = async (
    merkleFileUri: string,
    gateway: IPFSGatewayUri
  ) => {
    const Mintlist = await actions.getMintlist(
      merkleFileUri,
      gateway,
      cachedMintlist
    );
    return Mintlist;
  };
  const instance: Instance = {
    getSalePrice: async (signer: ethers.Signer): Promise<string> => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );
      const price = await contract.salePrice();
      return ethers.utils.formatEther(price).toString();
    },
    getSaleData: async (signer: ethers.Signer): Promise<SaleData> => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );

      const saleData: SaleData = await actions.getSaleData(
        contract,
        config.isEth
      );
      return saleData;
    },
    getSaleStartBlock: async (signer: ethers.Signer): Promise<string> => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );
      const startBlock = await contract.saleStartBlock();
      return startBlock.toString();
    },
    getSaleStatus: async (signer: ethers.Signer): Promise<SaleStatus> => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );
      const status: SaleStatus = await actions.getSaleStatus(contract);
      return status;
    },
    getMintlist: async (gateway: IPFSGatewayUri): Promise<Mintlist> => {
      const whitelist = await actions.getMintlist(
        config.merkleTreeFileUri,
        gateway,
        cachedMintlist
      );
      return whitelist;
    },
    getMintlistedUserClaim: async (
      address: string,
      gateway: IPFSGatewayUri
    ): Promise<Claim> => {
      const mintlist = await getMintlist(config.merkleTreeFileUri, gateway);
      const userClaim: Claim = mintlist.claims[address];
      if (!userClaim) {
        throw Error(
          `No claim could be found for user ${address} because they are not on the whitelist`
        );
      }
      return userClaim;
    },
    getSaleMintlistDuration: async (
      signer: ethers.Signer
    ): Promise<ethers.BigNumber> => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );
      const duration = await contract.privateSaleDuration();
      return duration;
    },
    getTotalForSale: async (
      signer: ethers.Signer
    ): Promise<ethers.BigNumber> => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );
      const total = await contract.publicSaleQuantity();
      return total;
    },
    getNumberOfDomainsSold: async (
      signer: ethers.Signer
    ): Promise<ethers.BigNumber> => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );
      const domainsSold = await contract.domainsSold();
      return domainsSold;
    },
    getBlockNumber: async (): Promise<number> => {
      const provider = ethers.providers.getDefaultProvider();
      const blockNum = await provider.getBlockNumber();
      return blockNum;
    },
    getEthBalance: async (signer: ethers.Signer): Promise<string> => {
      const balance = await signer.getBalance();
      return ethers.utils.formatEther(balance);
    },
    isUserOnMintlist: async (
      address: string,
      gateway: IPFSGatewayUri
    ): Promise<boolean> => {
      const mintlist = await actions.getMintlist(
        config.merkleTreeFileUri,
        gateway,
        cachedMintlist
      );
      const isOnWhitelist = mintlist.claims[address] ? true : false;
      return isOnWhitelist;
    },
    getDomainsPurchasedByAccount: async (
      signer: ethers.Signer
    ): Promise<number> => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );
      const address = await signer.getAddress();
      const domains = await contract.domainsPurchasedByAccount(address);
      return domains.toNumber();
    },
    purchaseDomains: async (
      count: ethers.BigNumber,
      signer: ethers.Signer,
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );

      const tx = await actions.purchaseDomains(
        count,
        signer,
        config.merkleTreeFileUri,
        contract,
        cachedMintlist,
        getMintlist,
      );
      return tx;
    },
    setPauseStatus: async (
      pauseStatus: boolean,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getWolfSaleContract(
        signer,
        config.contractAddress
      );
      const tx = await actions.setPauseStatus(pauseStatus, contract, signer);
      return tx;
    },
  };

  return instance;
};
