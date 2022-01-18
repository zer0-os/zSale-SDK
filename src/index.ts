import { ethers } from "ethers";

import { getWhiteListSaleContract } from "./contracts";
import * as actions from "./actions";
import {
  Claim,
  Config,
  Instance,
  IPFSGatewayUri,
  Maybe,
  SaleData,
  SaleStatus,
  Whitelist,
} from "./types";

export const createInstance = (config: Config): Instance => {
  let cachedWhitelist: Maybe<Whitelist>;

  const getWhitelist = async (
    merkleFileUri: string,
    gateway: IPFSGatewayUri
  ) => {
    const whitelist = await actions.getWhitelist(
      merkleFileUri,
      gateway,
      cachedWhitelist
    );
    return whitelist;
  };
  const instance: Instance = {
    getSalePrice: async (signer: ethers.Signer): Promise<string> => {
      const contract = await getWhiteListSaleContract(
        signer,
        config.contractAddress
      );
      const price = await contract.salePrice();
      return ethers.utils.formatEther(price).toString();
    },
    getSaleData: async (signer: ethers.Signer): Promise<SaleData> => {
      const contract = await getWhiteListSaleContract(
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
      const contract = await getWhiteListSaleContract(
        signer,
        config.contractAddress
      );
      const startBlock = await contract.saleStartBlock();
      return startBlock.toString();
    },
    getSaleStatus: async (signer: ethers.Signer): Promise<SaleStatus> => {
      const contract = await getWhiteListSaleContract(
        signer,
        config.contractAddress
      );
      const status: SaleStatus = await actions.getSaleStatus(contract);
      return status;
    },
    getWhitelist: async (gateway: IPFSGatewayUri): Promise<Whitelist> => {
      const whitelist = await getWhitelist(config.merkleTreeFileUri, gateway);
      return whitelist;
    },
    getWhiteListedUserClaim: async (
      address: string,
      gateway: IPFSGatewayUri
    ): Promise<Claim> => {
      const whitelist = await getWhitelist(config.merkleTreeFileUri, gateway);
      const userClaim: Claim = whitelist.claims[address];
      if (!userClaim) {
        throw Error(
          `No claim could be found for user ${address} because they are not on the whitelist`
        );
      }
      return userClaim;
    },
    getSaleWhiteListDuration: async (
      signer: ethers.Signer
    ): Promise<ethers.BigNumber> => {
      const contract = await getWhiteListSaleContract(
        signer,
        config.contractAddress
      );
      const duration = await contract.whitelistSaleDuration();
      return duration;
    },
    getTotalForSale: async (
      signer: ethers.Signer
    ): Promise<ethers.BigNumber> => {
      const contract = await getWhiteListSaleContract(
        signer,
        config.contractAddress
      );
      const total = await contract.totalForSale();
      return total;
    },
    getNumberOfDomainsSold: async (
      signer: ethers.Signer
    ): Promise<ethers.BigNumber> => {
      const contract = await getWhiteListSaleContract(
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
    isUserOnWhitelist: async (
      address: string,
      gateway: IPFSGatewayUri
    ): Promise<boolean> => {
      const whitelist = await getWhitelist(config.merkleTreeFileUri, gateway);
      const isOnWhitelist = whitelist.claims[address] ? true : false;
      return isOnWhitelist;
    },
    getDomainsPurchasedByAccount: async (
      signer: ethers.Signer
    ): Promise<number> => {
      const contract = await getWhiteListSaleContract(
        signer,
        config.contractAddress
      );
      const address = await signer.getAddress();
      const domains = await contract.domainsPurchasedByAccount(address);
      return domains.toNumber();
    },
    getCurrentMaxPurchaseCount: async (
      signer: ethers.Signer
    ): Promise<number> => {
      const contract = await getWhiteListSaleContract(
        signer,
        config.contractAddress
      );
      const count = await contract.currentMaxPurchaseCount();
      return count.toNumber();
    },
    purchaseDomains: async (
      count: ethers.BigNumber,
      signer: ethers.Signer,
      saleToken?: string
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getWhiteListSaleContract(
        signer,
        config.contractAddress
      );

      const tx = await actions.purchaseDomains(
        count,
        signer,
        config.merkleTreeFileUri,
        config.isEth,
        contract,
        getWhitelist,
        saleToken
      );
      return tx;
    },
    setPauseStatus: async (
      pauseStatus: boolean,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getWhiteListSaleContract(
        signer,
        config.contractAddress
      );
      const tx = await actions.setPauseStatus(pauseStatus, contract, signer);
      return tx;
    },
    allowance: async (
      userAddress: string,
      provider: ethers.providers.Provider
    ): Promise<ethers.BigNumber> => {
      const allowance = await actions.allowance(config, userAddress, provider);
      return allowance;
    },
    approve: async (
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      if (config.isEth) {
        throw Error(
          "Cannot call ERC20 'approve' when sale token is not an ERC20 token"
        );
      }
      // User must call to approve the sale contract to spend their tokens
      const tx = await actions.approve(config, signer);
      return tx;
    },
    balanceOf: async (
      saleTokenAddress: string,
      userAddress: string,
      provider: ethers.providers.Provider
    ): Promise<ethers.BigNumber> => {
      const balance = await actions.balanceOf(
        saleTokenAddress,
        userAddress,
        provider
      );
      return balance;
    },
  };

  return instance;
};
