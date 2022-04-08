import * as ethers from "ethers";

/**
 * isEth - Mark if a sale for the domain is in ETH or in Token
 * contractAddress - The address of the sale contract in 0x... format
 * merkleTreeFileUrl - A file path to the merkle tree for identifying Mintlisted users
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
  PrivateSale,
  PublicSale,
}

export interface Claim {
  index: number;
  proof: string[];
  quantity: number;
}

export interface Claims {
  [address: string]: Claim;
}

export interface Mintlist {
  merkleRoot: string;
  claims: Claims;
}

export interface SaleData {
  amountSold: number;
  amountForSale: number;
  amountForSalePrivate: number;
  salePrice: string;
  started: boolean;
  mintlistDuration: number;
  paused: boolean;
  startBlock?: number;
}

export type Maybe<T> = T | undefined | null;

export interface Instance {
  getSalePrice(signer: ethers.Signer): Promise<string>;
  getSaleData(signer: ethers.Signer): Promise<SaleData>;
  getSaleStartBlock(signer: ethers.Signer): Promise<string>;
  getSaleStatus(signer: ethers.Signer): Promise<SaleStatus>;
  getMintlist(gateway: IPFSGatewayUri): Promise<Mintlist>;
  getMintlistedUserClaim(
    address: string,
    gateway: IPFSGatewayUri
  ): Promise<Claim>;
  getSaleMintlistDuration(signer: ethers.Signer): Promise<ethers.BigNumber>;
  getTotalForSale(signer: ethers.Signer): Promise<ethers.BigNumber>;
  getNumberOfDomainsSold(signer: ethers.Signer): Promise<ethers.BigNumber>;
  getBlockNumber(): Promise<number>;
  getEthBalance(signer: ethers.Signer): Promise<string>;
  isUserOnMintlist(address: string, gateway: IPFSGatewayUri): Promise<boolean>;
  getDomainsPurchasedByAccount(signer: ethers.Signer): Promise<number>;
  purchaseDomains(
    count: ethers.BigNumber,
    signer: ethers.Signer,
    saleToken?: string
  ): Promise<ethers.ContractTransaction>;
  setPauseStatus(
    pauseStatus: boolean,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;
}
