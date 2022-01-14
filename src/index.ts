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
  Whitelist
} from "./types";

export const createInstance = (config: Config): Instance => {
  let cachedWhitelist: Maybe<Whitelist>;

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

      const saleData: SaleData = await actions.getSaleData(contract, config.isEth);
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
      const whitelist = await actions.getWhitelist(config.merkleTreeFileUri, gateway, cachedWhitelist)
      return whitelist;
    },
    getWhiteListedUserClaim: async (
      signer: ethers.Signer,
      gateway: IPFSGatewayUri
    ): Promise<Claim | undefined> => {
      const address = await signer.getAddress();
      const claim = await actions.getWhiteListedUserClaim(
        address,
        config.merkleTreeFileUri,
        gateway,
        cachedWhitelist);
      return claim;
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
      signer: ethers.Signer,
      gateway: IPFSGatewayUri
    ): Promise<boolean> => {
      const address = await signer.getAddress();
      const isOnWhitelist = await actions.isUserOnWhitelist(
        address,
        config.merkleTreeFileUri,
        gateway,
        cachedWhitelist
      );
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
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getWhiteListSaleContract(
        signer,
        config.contractAddress
      );

      // const address = await signer.getAddress();
      const tx = await actions.purchaseDomains(
        count,
        signer,
        config.merkleTreeFileUri,
        config.isEth,
        contract,
        cachedWhitelist
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
      saleTokenAddress: string,
      signer: ethers.Signer
    ): Promise<ethers.BigNumber> => {
      const allowance = await actions.allowance(
        saleTokenAddress,
        config.contractAddress,
        signer
      );
      return allowance;
    },
    approve: async (
      saleTokenAddress: string,
      spender: string,
      signer: ethers.Signer,
    ): Promise<ethers.ContractTransaction> => {
      if (config.isEth)
        throw Error("Cannot call ERC20 'approve' when sale token is ETH");

      const tx = await actions.approve(
        saleTokenAddress,
        spender,
        signer
      );
      return tx;
    },
    balanceOf: async (
      saleTokenAddress: string,
      signer: ethers.Signer
    ): Promise<ethers.BigNumber> => {
      const balance = await actions.balanceOf(saleTokenAddress, signer);
      return balance;
    }
  };

  return instance;
};
