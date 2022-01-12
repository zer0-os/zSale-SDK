import * as ethers from "ethers";

/**
 * isEth - Mark if a sale for the domain is in ETH or in Token
 * contractAddress - The address of the sale contract in 0x... format
 * merkleTreeFileUrl - A file path to the merkle tree for identifying whitelisted users
 */
export interface Config {
  isEth: boolean;
  contractAddress: string;
  merkleTreeFileUri: string;
}

export enum IPFSGatewayUri {
  ipfs = "ipfs.io",
  fleek = "ipfs.fleek.co",
}

export enum SaleStatus {
  NotStarted,
  WhiteListOnly,
  Public,
}

export interface Claim {
  index: number;
  proof: string[];
}

export interface Claims {
  [address: string]: Claim;
}

export interface MerkleTree {
  merkleRoot: string;
  string: string;
  claims: Claims;
}

export interface Instance {
  getSalePrice(signer: ethers.Signer): Promise<string>;
  getSaleStartBlock(signer: ethers.Signer): Promise<string>;
  getSaleStatus(signer: ethers.Signer): Promise<SaleStatus>;
  getSaleWhiteListDuration(signer: ethers.Signer): Promise<ethers.BigNumber>;
  getTotalForSale(signer: ethers.Signer): Promise<ethers.BigNumber>;
  getNumberOfDomainsSold(signer: ethers.Signer): Promise<ethers.BigNumber>;
  getDomainsPurchasedByAccount(signer: ethers.Signer): Promise<any>;
  getCurrentMaxPurchaseCount(signer: ethers.Signer): Promise<string>;
  purchaseDomains(
    count: ethers.BigNumber,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;
  setPauseStatus(
    pauseStatus: boolean,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;
}
