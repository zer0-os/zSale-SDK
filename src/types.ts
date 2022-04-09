import * as ethers from "ethers";

/**
 * isEth - Mark if a sale for the domain is in ETH or in Token
 * contractAddress - The address of the sale contract in 0x... format
 * merkleTreeFileUri - A file path to the merkle tree for identifying Mintlisted users
 * publicSalePurchaseLimit - What to return as the purchase limit during public sale (since it is technically unlimited)
 */
export interface Config {
  isEth: boolean;
  contractAddress: string;
  merkleTreeFileUri: string;
  publicSalePurchaseLimit?: number;
  advanced?: {
    // IPFS Hash of the merkle tree
    merkleTreeFileIPFSHash?: string;
    // IPFS Gateway to use (should be fully formed, ie: https://ipfs.fleek.co/ipfs)
    ipfsGateway?: string;
  };
}

export enum SaleStatus {
  NotStarted,
  PrivateSale,
  PublicSale,
  Ended,
}

export interface Claim {
  index: number;
  proof: string[];
  quantity: number;
}

export interface Claims {
  [address: string]: Claim | undefined;
}

export interface Mintlist {
  merkleRoot: string;
  claims: Claims;
}

export interface SaleData {
  amountSold: number;
  // How many are for sale given the current phase (private or public sale)
  amountForSale: number;
  salePrice: string;
  started: boolean;
  mintlistDuration: number;
  paused: boolean;
  startBlock?: number;
  advanced: {
    amountForSalePrivate: number;
    amountForSalePublic: number;
  };
}

export type Maybe<T> = T | undefined | null;

export interface Instance {
  // Get the price of the sale
  getSalePrice(signer: ethers.Signer): Promise<string>;

  // Get data about the current sale
  getSaleData(signer: ethers.Signer): Promise<SaleData>;

  // Get the block that the sale started on
  getSaleStartBlock(signer: ethers.Signer): Promise<string>;

  // Get the current status of the sale
  getSaleStatus(signer: ethers.Signer): Promise<SaleStatus>;

  // Get the mint list
  getMintlist(): Promise<Mintlist>;

  // Get a users claim from the mintlist
  getMintlistedUserClaim(address: string): Promise<Claim>;

  // Get how long the private sale lasts for
  getSaleMintlistDuration(signer: ethers.Signer): Promise<ethers.BigNumber>;

  // Get how many domains for for sale (in the current phase)
  getTotalForSale(signer: ethers.Signer): Promise<ethers.BigNumber>;

  // Get the number of domains that have been sold
  getNumberOfDomainsSold(signer: ethers.Signer): Promise<ethers.BigNumber>;

  // Get the current block number
  getBlockNumber(): Promise<number>;

  // Get the eth balance of a user
  getEthBalance(signer: ethers.Signer): Promise<string>;

  // Check if a user is on the mint list
  isUserOnMintlist(address: string): Promise<boolean>;

  // Get the number of domains purchase by a user
  getDomainsPurchasedByAccount(signer: ethers.Signer): Promise<number>;

  // Purchase domains
  purchaseDomains(
    count: ethers.BigNumber,
    signer: ethers.Signer,
    saleToken?: string
  ): Promise<ethers.ContractTransaction>;

  // Admin helper to pause the sale
  setPauseStatus(
    pauseStatus: boolean,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;

  // Get the amount a user could purchase
  numberPurchasableByAccount(signer: ethers.Signer): Promise<number>;
}
