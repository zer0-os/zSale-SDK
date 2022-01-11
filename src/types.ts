import * as ethers from "ethers";

/**
 * isEth - Mark if a sale for the domain is in ETH or in Token
 * contractAddress - The address of the sale contract in 0x... format
 * merkleTreeFileUrl - A file path to the merkle tree for identifying whitelisted users
 */
export interface Config {
  isEth: boolean;
  contractAddress: string;
  merkleTreeFileUrl: string;
}

export enum SaleStatus {
  NotStarted,
  WhiteListOnly,
  Public
}

export interface Instance {
  getSaleStartBlock(
    signer: ethers.Signer
  ): Promise<number>;
  getSaleStatus(
    signer: ethers.Signer
  ): Promise<SaleStatus>;
  getSaleWhiteListDuration(
    signer: ethers.Signer
  ): Promise<ethers.BigNumber>;
  getTotalForSale(
    signer: ethers.Signer
  ): Promise<ethers.BigNumber>;
  getNumberOfDomainsSold(
    signer: ethers.Signer
  ): Promise<ethers.BigNumber>
  setPauseStatus(
    signer: ethers.Signer,
    pauseStatus: boolean
  ): Promise<ethers.ContractTransaction>
}
