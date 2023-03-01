import * as ethers from "ethers";

export type Maybe<T> = T | undefined | null;

/**
 * Configuration Object
 */
export interface ClaimSaleConfig {
  /**
   * Address of the sale contract
   */
  contractAddress: string;

  /**
   * web3 provider to access blockchain with (on read operations)
   */
  web3Provider: ethers.providers.Provider;

  /**
   * Registrar that holds the domains being used to claim for this sale.
   */
  claimingRegistrarAddress: string;

  /**
   * Advanced settings / properties
   */
  advanced?: {
    /**
     * IPFS Gateway to use
     * (Should be fully formed, ie: https://ipfs.fleek.co/ipfs)
     */
    ipfsGateway?: string;
  };
}

export interface AirWildS2Config {
  /**
   * Address of the sale contract
   */
  contractAddress: string;

  /**
   * Since there are going to be multiple whitelists, we need to be able to access all of them - so we have a list of merkle tree URIs
   */
  merkleTreeFileUris: string[];

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
     * IPFS Hashes of the merkle trees, used as a fallback if the `merkleTreeFileUris` list is not an IPFS url at a given entry
     */
    merkleTreeFileIPFSHashes?: string[];

    /**
     * IPFS Gateway to use
     * (Should be fully formed, ie: https://ipfs.fleek.co/ipfs)
     */
    ipfsGateway?: string;
  };
}

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

export interface GenSaleConfig {
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
   * amount the SDK should return for the maximum amount purchasable in a single transaction in private sale
   */
  privateSaleTransactionLimit?: number;

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

export enum SaleStatus {
  NotStarted,
  PrivateSale,
  PublicSale,
  Ended,
}

export enum GenSaleStatus {
  NotStarted,
  ClaimSale,
  PrivateSale,
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
/**
 * A domain that could be used in a claim sale to claim a new domain.
 */
export interface ClaimableDomain {
  id: string;
  canBeClaimed: boolean;
}

export interface AirWildS2SaleData {
  /**
   * how many have been sold
   */
  amountSold: number;
  /**
   * How many are for sale given the current phase (private or public sale)
   */
  amountForSale: number;
  /**
   * the sale price
   */
  salePrice: string;
  /**
   * has the sale started
   */
  started: boolean;
  /**
   * how long the private sale will last
   */
  privateSaleDuration: number;
  /**
   * is the sale paused
   */
  paused: boolean;
  /**
   * when did the sale start (only defined if the sale started)
   */
  startBlock?: number;
  /**
   * when will the public sale start (only defined if the sale started)
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

export interface AirWildS2Instance {
  /** Get the price of the sale */
  getSalePrice(): Promise<string>;

  /** Get data about the current sale */
  getSaleData(): Promise<AirWildS2SaleData>;

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

export interface GenSaleInstance {
  /** Get the price of the sale */
  getSalePrice(): Promise<string>;

  /** Get data about the current sale */
  getSaleData(): Promise<GenSaleData>;

  /** Get the block that the sale started on (will be zero unless the sale already started) */
  getSaleStartBlock(): Promise<string>;

  /** Get the current status of the sale */
  getSaleStatus(): Promise<GenSaleStatus>;

  /** Get the mint list */
  getMintlist(): Promise<Mintlist>;

  /** Sets the price of the sale */
  setSalePrice(price: ethers.BigNumber, signer: ethers.Signer): Promise<ethers.ContractTransaction>;

  /** Get a users claim from the mintlist */
  getMintlistedUserClaim(address: string): Promise<Claim>;

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

export interface GenSaleData {
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
   * Is the sale paused
   */
  paused: boolean;
  /**
   * When did the sale start (only defined if the sale started)
   */
  startBlock?: number;
  /**
   * What phase is the sale currently in?
   * Not Started - The Sale has not yet started
   * Claim Sale - The sale is accepting GEN Claims from accounts in the Merkle Tree
   * Private Sael - The sale is accepting private purchases from accounts in the Merkle Tree
   * Ended - The sale is over
   */
  //genSaleStatus?: GenSaleStatus;

  /**
   * How many domains a wallet may buy in one transaction in the Private Sale
   */
  limitPerTransaction?: number;

  advanced: {
    /**
     * How many are for sale
     */
    amountForSale: number;
  };
}


export interface ClaimWithChildInstance {
  /** Get the price of the sale */
  getSalePrice(): Promise<string>;

  /** Get data about the current sale */
  getSaleData(): Promise<ClaimWithChildSaleData>;

  /** Get the block that the sale started on (will be zero unless the sale already started) */
  getSaleStartBlock(): Promise<string>;

  /** Get the current status of the sale */
  getSaleStatus(): Promise<SaleStatus>;

  /** Get how long the sale lasts for */
  getSaleDuration(): Promise<ethers.BigNumber>;

  /** Get how many domains for for sale (in the current phase) */
  getTotalForSale(): Promise<ethers.BigNumber>;

  /** Get the number of domains that have been sold */
  getNumberOfDomainsSold(): Promise<ethers.BigNumber>;

  /** Get the current block number */
  getBlockNumber(): Promise<number>;

  /** Get the eth balance of a user */
  getEthBalance(address: string): Promise<string>;

  /** Returns true if an NFT can still be used to make a claim, and false otherwise */
  canBeClaimed(domainId: string): Promise<boolean>;

  /** Return the address of the user who has claimed the given domain ID, or the Zero Address if no one has claimed with that ID yet. */
  domainClaimedBy(domainId: string): Promise<string>;

  /** Purchase domains */
  claimDomains(
    claimingIds: string[],
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;

  /** Admin helper to pause the sale */
  setPauseStatus(
    pauseStatus: boolean,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction>;

  /** Get a list of the token IDs owned by a given wallet which could be used to claim a domain */
  getClaimingIDsForUser(walletAddress: string): Promise<ClaimableDomain[]>;
}

export interface ClaimWithChildSaleData {
  /**
   * how many have been sold
   */
  amountSold: number;
  /**
   * How many are for sale given the current phase (private or public sale)
   */
  amountForSale: number;
  /**
   * the sale price
   */
  salePrice: string;
  /**
   * has the sale started
   */
  started: boolean;
  /**
   * how long the private sale will last
   */
  saleDuration: number;
  /**
   * is the sale paused
   */
  paused: boolean;
  /**
   * when did the sale start (only defined if the sale started)
   */
  startBlock?: number;
}
