import * as ethers from "ethers";

export type Maybe<T> = T | undefined | null;

export interface Config {
  // address of the sale contract
  contractAddress: string;

  // url to the merkle tree file
  merkleTreeFileUri: string;

  // web3 provider to access blockchain with (on read operations)
  web3Provider: ethers.providers.Provider;

  // amount the SDK should return for the public sale purchase limit (in theory this is infinite)
  publicSalePurchaseLimit?: number;

  // advanced settings / properties
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
  [address: string]: Maybe<Claim>;
}

export interface Mintlist {
  merkleRoot: string;
  claims: Claims;
}

export interface SaleData {
  // how many have been sold
  amountSold: number;
  // How many are for sale given the current phase (private or public sale)
  amountForSale: number;
  // the sale price
  salePrice: string;
  // has the sale started
  started: boolean;
  // how long the private sale will last
  privateSaleDuration: number;
  // is the sale paused
  paused: boolean;
  // when did the sale start (only defined if the sale started)
  startBlock?: number;
  // when will the public sale start (only defined if the sale started)
  publicSaleStartBlock?: number;

  advanced: {
    // how many are for sale during the private sale
    amountForSalePrivate: number;

    // how many are for sale during the public sale
    amountForSalePublic: number;
  };
}

export interface Instance {
  // Get the price of the sale
  getSalePrice(): Promise<string>;

  // Get data about the current sale
  getSaleData(): Promise<SaleData>;

  // Get the block that the sale started on (will be zero unless the sale already started)
  getSaleStartBlock(): Promise<string>;

  // Get the current status of the sale
  getSaleStatus(): Promise<SaleStatus>;

  // Get the mint list
  getMintlist(): Promise<Mintlist>;

  // Get a users claim from the mintlist
  getMintlistedUserClaim(address: string): Promise<Claim>;

  // Get how long the private sale lasts for
  getSaleMintlistDuration(): Promise<ethers.BigNumber>;

  // Get how many domains for for sale (in the current phase)
  getTotalForSale(): Promise<ethers.BigNumber>;

  // Get the number of domains that have been sold
  getNumberOfDomainsSold(): Promise<ethers.BigNumber>;

  // Get the current block number
  getBlockNumber(): Promise<number>;

  // Get the eth balance of a user
  getEthBalance(address: string): Promise<string>;

  // Check if a user is on the mint list
  isUserOnMintlist(address: string): Promise<boolean>;

  // Get the number of domains purchase by a user
  getDomainsPurchasedByAccount(address: string): Promise<number>;

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
  numberPurchasableByAccount(address: string): Promise<number>;
}
