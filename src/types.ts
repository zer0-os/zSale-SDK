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
  tokenTotal: string;
  claims: Claims;
}

export interface Whitelist {
  merkleRoot: string;
  claims: Claims;
}

export interface SaleData {
  amountSold: number;
  amountForSale: number;
  salePrice: string;
  started: boolean;
  whitelistDuration: number;
  paused: boolean;
  currentMaxPurchases: number;
  maxPurchasesDuringWhitelist: number;
  maxPurchasesPostWhitelist: number;
  isEth: boolean;
  startBlock?: number;
  saleToken?: string;
}

export type Maybe<T> = T | undefined | null;

export interface Instance {
  getSalePrice(signer: ethers.Signer): Promise<string>;
  getSaleData(signer: ethers.Signer): Promise<SaleData>;
  getSaleStartBlock(signer: ethers.Signer): Promise<string>;
  getSaleStatus(signer: ethers.Signer): Promise<SaleStatus>;
  getWhitelist(
    gateway: IPFSGatewayUri,
    cachedWhitelist: Maybe<Whitelist>
  ): Promise<Whitelist>;
  getWhiteListedUserClaim(
    signer: ethers.Signer,
    gateway: IPFSGatewayUri,
    cachedWhitelist: Maybe<Whitelist>
  ): Promise<Claim | undefined>;
  getSaleWhiteListDuration(signer: ethers.Signer): Promise<ethers.BigNumber>;
  getTotalForSale(signer: ethers.Signer): Promise<ethers.BigNumber>;
  getNumberOfDomainsSold(signer: ethers.Signer): Promise<ethers.BigNumber>;
  getBlockNumber(): Promise<number>;
  getEthBalance(signer: ethers.Signer): Promise<string>
  isUserOnWhitelist(
    signer: ethers.Signer,
    gateway: IPFSGatewayUri
  ): Promise<boolean>;
  getDomainsPurchasedByAccount(signer: ethers.Signer): Promise<number>;
  getCurrentMaxPurchaseCount(signer: ethers.Signer): Promise<number>;
  purchaseDomains(
    count: ethers.BigNumber,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;
  setPauseStatus(
    pauseStatus: boolean,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;
  allowance(
    saleTokenAddress: string,
    signer: ethers.Signer
  ): Promise<ethers.BigNumber>;
  approve(
    saleTokenAddress: string,
    spender: string,
    signer: ethers.Signer,
  ): Promise<ethers.ContractTransaction>;
  balanceOf(
    saleTokenAddress: string,
    signer: ethers.Signer
  ): Promise<ethers.BigNumber>
}
