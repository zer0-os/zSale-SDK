import * as ethers from "ethers";

export type Maybe<T> = T | undefined | null;

/**
 * Reusable Sale Config
 */
export type SaleConfiguration = {
  amountSold: ethers.BigNumber;
  sellerWallet: string;
  parentDomainId: string;
  publicSalePrice: string;
  privateSalePrice: string;
  mintlistSaleDurationSeconds: number;
  amountForSale: ethers.BigNumber;
  mintlistMerkleRoot: string;
  startingMetadataIndex: ethers.BigNumber;
  folderGroupID: ethers.BigNumber;
  publicSaleLimit: ethers.BigNumber;
};

export type SaleData = {
  saleId: string;
  salePhaseName: string;
  saleStartTimeSeconds: number;
  salePhase: SalePhase;
  saleCounter: number;
  saleConfiguration: SaleConfiguration;
};

export interface WapeSaleConfig {
  /**
   * Address of the sale contract
   */
  contractAddress: string;

  /**
   * URI for the merkle tree file
   */
  merkleTreeFileUri: string;

  /**
   * web3 provider to access blockchain with (on read operations)
   */
  web3Provider: ethers.providers.Provider;

  /**
   * amount the SDK should return for the public sale purchase limit
   * (in theory this is infinite)
   */
  publicSalePurchaseLimit?: number;

  /**
   * Advanced settings / properties
   */
  advanced?: {
    /**
     * IPFS Hashes of the merkle tree, used as a fallback if the `merkleTreeFileUri` is not an IPFS url at a given entry
     */
    merkleTreeFileIPFSHash?: string;

    /**
     * IPFS Gateway to use
     * (Should be fully formed, ie: https://ipfs.fleek.co/ipfs)
     */
    ipfsGateway?: string;
  };
}

export interface SaleContractConfig {
  /**
   * Address of the sale contract
   */
  contractAddress: string;

  /**
   * URI for the merkle tree file
   */
  merkleTreeFileUri: string;

  /**
   * web3 provider to access blockchain with (on read operations)
   */
  web3Provider: ethers.providers.Provider;

  /**
   * Advanced settings / properties
   */
  advanced?: {
    /**
     * IPFS Hashes of the merkle tree, used as a fallback if the `merkleTreeFileUri` is not an IPFS url at a given entry
     */
    merkleTreeFileIPFSHash?: string;

    /**
     * IPFS Gateway to use
     * (Should be fully formed, ie: https://ipfs.fleek.co/ipfs)
     */
    ipfsGateway?: string;
  };
}

/**
 * Legacy steps for WapeSale
 */
export enum SaleStatus {
  NotStarted,
  PrivateSale,
  PublicSale,
  Ended,
}

export enum SalePhase {
  Inactive,
  ReadyForNewSale,
  Private,
  Public,
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
/**
 * A domain that could be used in a claim sale to claim a new domain.
 */
export interface ClaimableDomain {
  id: string;
  canBeClaimed: boolean;
}

export interface WapeSaleData {
  /**
   * How many have been sold
   */
  amountSold: number;
  /**
   * How many are for sale given the current phase (private or public sale)
   */
  amountForSale: number;
  /**
   * The sale price
   */
  salePrice: string;
  /**
   * Has the sale started
   */
  started: boolean;
  /**
   * How long the private sale will last in blocks
   */
  privateSaleDuration: number;
  /**
   * Is the sale paused
   */
  paused: boolean;
  /**
   * When did the sale start (only defined if the sale started)
   */
  startBlock?: number;
  /**
   * When will the public sale start (only defined if the sale started)
   */
  publicSaleStartBlock?: number;

  advanced: {
    /**
     * how many are for sale during the private sale
     */
    amountForSalePrivate: number;

    /**
     * how many are for sale during the public sale
     */
    amountForSalePublic: number;
  };
}

export interface WapeSaleInstance {
  /** Get the price of the sale */
  getSalePrice(): Promise<string>;

  /** Get data about the current sale */
  getSaleData(): Promise<WapeSaleData>;

  /** Get the block that the sale started on (will be zero unless the sale already started) */
  getSaleStartBlock(): Promise<string>;

  /** Get the current status of the sale */
  getSaleStatus(): Promise<SaleStatus>;

  /** Get the mint list */
  getMintlist(): Promise<Mintlist>;

  /** Get a users claim from the mintlist */
  getMintlistedUserClaim(address: string): Promise<Claim>;

  /** Get how long the private sale lasts for */
  getSaleMintlistDuration(): Promise<ethers.BigNumber>;

  /** Get how many domains for for sale (in the current phase) */
  getTotalForSale(): Promise<ethers.BigNumber>;

  /** Get the number of domains that have been sold */
  getNumberOfDomainsSold(): Promise<ethers.BigNumber>;

  /** Get the current block number */
  getBlockNumber(): Promise<number>;

  /** Get the eth balance of a user */
  getEthBalance(address: string): Promise<string>;

  /** Check if a user is on the mint list */
  isUserOnMintlist(address: string): Promise<boolean>;

  /** Get the number of domains purchase by a user */
  getDomainsPurchasedByAccount(address: string): Promise<number>;

  /** Purchase domains */
  purchaseDomains(
    count: ethers.BigNumber,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;

  /** Admin helper to pause the sale */
  setPauseStatus(
    pauseStatus: boolean,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;

  /** Get the amount a user could purchase */
  numberPurchasableByAccount(address: string): Promise<number>;
}

export type PriceInfo = {
  publicPrice: string;
  privatePrice: string;
};

export interface SaleInstance {
  /** Get the price of the sale */
  getSalePrice(): Promise<PriceInfo>;

  /** Get data about the current sale */
  getSaleData(): Promise<SaleData>;

  /** Gets the timestamp (seconds) of the block the sale started on (will be zero unless the sale already started) */
  getSaleStartTime(): Promise<string>;

  /** Get the current phase of the sale */
  getSaleStatus(): Promise<SalePhase>;

  /** Get the mint list */
  getMintlist(): Promise<Mintlist>;

  /** Get a users claim from the mintlist */
  getMintlistedUserClaim(address: string): Promise<Claim>;

  /** Get how long the private sale lasts for */
  getSaleMintlistDuration(): Promise<ethers.BigNumber>;

  /** Get how many domains for for sale (in the current phase) */
  getTotalForSale(): Promise<ethers.BigNumber>;

  /** Get the number of domains that have been sold */
  getNumberOfDomainsSold(): Promise<ethers.BigNumber>;

  /** Get the current block number */
  getBlockNumber(): Promise<number>;

  /** Get the eth balance of a user */
  getEthBalance(address: string): Promise<string>;

  /** Check if a user is on the mint list */
  isUserOnMintlist(address: string): Promise<boolean>;

  /** Get the number of domains purchase by a user for a given sale */
  getDomainsPurchasedByAccountForSale(
    activeSaleId: number,
    address: string
  ): Promise<number>;

  /** Purchase domains */
  purchaseDomains(
    count: ethers.BigNumber,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;

  /** Admin helper to pause the sale */
  setPauseStatus(
    pauseStatus: boolean,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;

  /** Get the amount a user could purchase */
  numberPurchasableByAccount(address: string): Promise<number>;
}
