import { ethers } from "ethers";

import { getWhiteListSaleContract } from "./contracts";
import * as actions from "./actions";
import {
  Config,
  Instance,
  SaleStatus
} from "./types"

export const createInstance = (config: Config): Instance => {

  const instance: Instance = {
    getSaleStartBlock: async (
      signer: ethers.Signer
    ): Promise<number> => {
      const contract = await getWhiteListSaleContract(signer, config.contractAddress);
      const startBlock = await contract.saleStartBlock();
      return Number(startBlock);
    },
    getSaleStatus: async (
      signer: ethers.Signer
    ): Promise<SaleStatus> => {
      const contract = await getWhiteListSaleContract(signer, config.contractAddress);
      const status = await actions.getSaleStatus(contract);
      return status;
    },
    getSaleWhiteListDuration: async (
      signer: ethers.Signer
    ): Promise<ethers.BigNumber> => {
      const contract = await getWhiteListSaleContract(signer, config.contractAddress);
      const duration = await contract.whitelistSaleDuration();
      return duration;
    },
    getTotalForSale: async (
      signer: ethers.Signer
    ): Promise<ethers.BigNumber> => {
      const contract = await getWhiteListSaleContract(signer, config.contractAddress);
      const total = await contract.totalForSale();
      return total;
    },
    getNumberOfDomainsSold: async (
      signer: ethers.Signer
    ): Promise<ethers.BigNumber> => {
      const contract = await getWhiteListSaleContract(signer, config.contractAddress);
      const domainsSold = await contract.domainsSold();
      return domainsSold;
    },
    setPauseStatus: async (
      signer: ethers.Signer,
      pauseStatus: boolean
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getWhiteListSaleContract(signer, config.contractAddress);
      const tx = await actions.setPauseStatus(pauseStatus, contract);
      return tx;
    },
  }

  return instance;
}
