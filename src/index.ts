import { ethers } from "ethers";
import { getWhiteListSale } from "./contracts";

import {
  Config,
  Instance
} from "./types"

export const createInstance = (config: Config): Instance => {

  const instance: Instance = {
    getSaleContract: async (signer: ethers.Signer) => {
      const contract = await getWhiteListSale(signer, config.contractAddress);
      return contract;
    },
    setPauseStatus: async (
      signer: ethers.Signer,
      pauseStatus: boolean
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getWhiteListSale(signer, config.contractAddress);

      const currentStatus = await contract.paused();
      if (pauseStatus === currentStatus)
        throw Error("Execution would cause no state change");

      const tx = await contract.setPauseStatus(pauseStatus);
      return tx;
    }
  }

  return instance;
}
