import { ethers } from "ethers";

import { getWhiteListSaleContract } from "./contracts";
import * as actions from "./actions";
import { Config, Instance, SaleStatus } from "./types";

export const createInstance = (config: Config): Instance => {

  const instance: Instance = {
    getSalePrice: async (signer: ethers.Signer): Promise<string> => {
      const contract = await getWhiteListSaleContract(
        signer,
        config.contractAddress
      );
      const price = await contract.salePrice();
      return ethers.utils.formatEther(price).toString();
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
      const tx = await actions.purchaseDomains(
        count,
        signer,
        config.merkleTreeFileUri,
        contract
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
  };

  return instance;
};
