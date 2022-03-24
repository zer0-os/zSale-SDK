/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface MintlistSimpleFolderIndexSaleInterface
  extends ethers.utils.Interface {
  functions: {
    "__MintlistSimpleFolderIndexSale_init(address,uint256,uint256,address,address,uint256,bytes32,uint256,string)": FunctionFragment;
    "addDomainsToSell(string[])": FunctionFragment;
    "baseFolderHashWithoutQm()": FunctionFragment;
    "controller()": FunctionFragment;
    "domainMetadataUris(uint256)": FunctionFragment;
    "domainsPurchasedByAccount(address)": FunctionFragment;
    "domainsSold()": FunctionFragment;
    "getNftByIndex(uint256)": FunctionFragment;
    "mintlistMerkleRoot()": FunctionFragment;
    "mintlistSaleDuration()": FunctionFragment;
    "owner()": FunctionFragment;
    "parentDomainId()": FunctionFragment;
    "paused()": FunctionFragment;
    "prefix()": FunctionFragment;
    "purchaseDomains(uint8,uint256,uint256,bytes32[])": FunctionFragment;
    "releaseDomain()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "salePrice()": FunctionFragment;
    "saleStartBlock()": FunctionFragment;
    "saleStarted()": FunctionFragment;
    "sellerWallet()": FunctionFragment;
    "setBaseFolderHash(string)": FunctionFragment;
    "setMerkleRoot(bytes32)": FunctionFragment;
    "setParentDomainId(uint256)": FunctionFragment;
    "setPauseStatus(bool)": FunctionFragment;
    "setSaleDuration(uint256)": FunctionFragment;
    "setSalePrice(uint256)": FunctionFragment;
    "setSellerWallet(address)": FunctionFragment;
    "setStartIndex(uint256)": FunctionFragment;
    "startSale()": FunctionFragment;
    "startingMetadataIndex()": FunctionFragment;
    "stopSale()": FunctionFragment;
    "totalForSale()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "zNSRegistrar()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "__MintlistSimpleFolderIndexSale_init",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      string,
      string,
      BigNumberish,
      BytesLike,
      BigNumberish,
      string
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addDomainsToSell",
    values: [string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "baseFolderHashWithoutQm",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "controller",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "domainMetadataUris",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "domainsPurchasedByAccount",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "domainsSold",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getNftByIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "mintlistMerkleRoot",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mintlistSaleDuration",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "parentDomainId",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(functionFragment: "prefix", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "purchaseDomains",
    values: [BigNumberish, BigNumberish, BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "releaseDomain",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "salePrice", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "saleStartBlock",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "saleStarted",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sellerWallet",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setBaseFolderHash",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setMerkleRoot",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setParentDomainId",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setPauseStatus",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setSaleDuration",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setSalePrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setSellerWallet",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setStartIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "startSale", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "startingMetadataIndex",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "stopSale", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalForSale",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "zNSRegistrar",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "__MintlistSimpleFolderIndexSale_init",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addDomainsToSell",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "baseFolderHashWithoutQm",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "controller", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "domainMetadataUris",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "domainsPurchasedByAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "domainsSold",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNftByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintlistMerkleRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintlistSaleDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "parentDomainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "prefix", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "purchaseDomains",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "releaseDomain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "salePrice", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "saleStartBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "saleStarted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sellerWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBaseFolderHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMerkleRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setParentDomainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPauseStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSaleDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSalePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSellerWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStartIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "startSale", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "startingMetadataIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stopSale", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalForSale",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "zNSRegistrar",
    data: BytesLike
  ): Result;

  events: {
    "DomainPurchased(address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RefundedEther(address,uint256)": EventFragment;
    "SaleStarted(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DomainPurchased"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RefundedEther"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SaleStarted"): EventFragment;
}

export class MintlistSimpleFolderIndexSale extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: MintlistSimpleFolderIndexSaleInterface;

  functions: {
    __MintlistSimpleFolderIndexSale_init(
      controller_: string,
      parentDomainId_: BigNumberish,
      price_: BigNumberish,
      zNSRegistrar_: string,
      sellerWallet_: string,
      mintlistSaleDuration_: BigNumberish,
      merkleRoot_: BytesLike,
      startingMetadataIndex_: BigNumberish,
      baseFolderHashWithoutQm_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addDomainsToSell(
      metadataUris: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    baseFolderHashWithoutQm(overrides?: CallOverrides): Promise<[string]>;

    controller(overrides?: CallOverrides): Promise<[string]>;

    domainMetadataUris(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    domainsPurchasedByAccount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    domainsSold(overrides?: CallOverrides): Promise<[BigNumber]>;

    getNftByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    mintlistMerkleRoot(overrides?: CallOverrides): Promise<[string]>;

    mintlistSaleDuration(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    parentDomainId(overrides?: CallOverrides): Promise<[BigNumber]>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    prefix(overrides?: CallOverrides): Promise<[string]>;

    purchaseDomains(
      count: BigNumberish,
      index: BigNumberish,
      purchaseLimit: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    releaseDomain(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    salePrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    saleStartBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    saleStarted(overrides?: CallOverrides): Promise<[boolean]>;

    sellerWallet(overrides?: CallOverrides): Promise<[string]>;

    setBaseFolderHash(
      folderHashWithoutQm: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMerkleRoot(
      root: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setParentDomainId(
      parentId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPauseStatus(
      pauseStatus: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSaleDuration(
      durationInBlocks: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSalePrice(
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSellerWallet(
      wallet: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setStartIndex(
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    startSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    startingMetadataIndex(overrides?: CallOverrides): Promise<[BigNumber]>;

    stopSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    totalForSale(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    zNSRegistrar(overrides?: CallOverrides): Promise<[string]>;
  };

  __MintlistSimpleFolderIndexSale_init(
    controller_: string,
    parentDomainId_: BigNumberish,
    price_: BigNumberish,
    zNSRegistrar_: string,
    sellerWallet_: string,
    mintlistSaleDuration_: BigNumberish,
    merkleRoot_: BytesLike,
    startingMetadataIndex_: BigNumberish,
    baseFolderHashWithoutQm_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addDomainsToSell(
    metadataUris: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  baseFolderHashWithoutQm(overrides?: CallOverrides): Promise<string>;

  controller(overrides?: CallOverrides): Promise<string>;

  domainMetadataUris(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  domainsPurchasedByAccount(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  domainsSold(overrides?: CallOverrides): Promise<BigNumber>;

  getNftByIndex(
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  mintlistMerkleRoot(overrides?: CallOverrides): Promise<string>;

  mintlistSaleDuration(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  parentDomainId(overrides?: CallOverrides): Promise<BigNumber>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  prefix(overrides?: CallOverrides): Promise<string>;

  purchaseDomains(
    count: BigNumberish,
    index: BigNumberish,
    purchaseLimit: BigNumberish,
    merkleProof: BytesLike[],
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  releaseDomain(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  salePrice(overrides?: CallOverrides): Promise<BigNumber>;

  saleStartBlock(overrides?: CallOverrides): Promise<BigNumber>;

  saleStarted(overrides?: CallOverrides): Promise<boolean>;

  sellerWallet(overrides?: CallOverrides): Promise<string>;

  setBaseFolderHash(
    folderHashWithoutQm: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMerkleRoot(
    root: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setParentDomainId(
    parentId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPauseStatus(
    pauseStatus: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSaleDuration(
    durationInBlocks: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSalePrice(
    price: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSellerWallet(
    wallet: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setStartIndex(
    index: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  startSale(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  startingMetadataIndex(overrides?: CallOverrides): Promise<BigNumber>;

  stopSale(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  totalForSale(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  zNSRegistrar(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    __MintlistSimpleFolderIndexSale_init(
      controller_: string,
      parentDomainId_: BigNumberish,
      price_: BigNumberish,
      zNSRegistrar_: string,
      sellerWallet_: string,
      mintlistSaleDuration_: BigNumberish,
      merkleRoot_: BytesLike,
      startingMetadataIndex_: BigNumberish,
      baseFolderHashWithoutQm_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    addDomainsToSell(
      metadataUris: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    baseFolderHashWithoutQm(overrides?: CallOverrides): Promise<string>;

    controller(overrides?: CallOverrides): Promise<string>;

    domainMetadataUris(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    domainsPurchasedByAccount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    domainsSold(overrides?: CallOverrides): Promise<BigNumber>;

    getNftByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    mintlistMerkleRoot(overrides?: CallOverrides): Promise<string>;

    mintlistSaleDuration(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    parentDomainId(overrides?: CallOverrides): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    prefix(overrides?: CallOverrides): Promise<string>;

    purchaseDomains(
      count: BigNumberish,
      index: BigNumberish,
      purchaseLimit: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    releaseDomain(overrides?: CallOverrides): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    salePrice(overrides?: CallOverrides): Promise<BigNumber>;

    saleStartBlock(overrides?: CallOverrides): Promise<BigNumber>;

    saleStarted(overrides?: CallOverrides): Promise<boolean>;

    sellerWallet(overrides?: CallOverrides): Promise<string>;

    setBaseFolderHash(
      folderHashWithoutQm: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setMerkleRoot(root: BytesLike, overrides?: CallOverrides): Promise<void>;

    setParentDomainId(
      parentId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setPauseStatus(
      pauseStatus: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setSaleDuration(
      durationInBlocks: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setSalePrice(price: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setSellerWallet(wallet: string, overrides?: CallOverrides): Promise<void>;

    setStartIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    startSale(overrides?: CallOverrides): Promise<void>;

    startingMetadataIndex(overrides?: CallOverrides): Promise<BigNumber>;

    stopSale(overrides?: CallOverrides): Promise<void>;

    totalForSale(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    zNSRegistrar(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    DomainPurchased(
      buyer?: null,
      domainId?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { buyer: string; domainId: BigNumber }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    RefundedEther(
      buyer?: null,
      amount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { buyer: string; amount: BigNumber }
    >;

    SaleStarted(
      block?: null
    ): TypedEventFilter<[BigNumber], { block: BigNumber }>;
  };

  estimateGas: {
    __MintlistSimpleFolderIndexSale_init(
      controller_: string,
      parentDomainId_: BigNumberish,
      price_: BigNumberish,
      zNSRegistrar_: string,
      sellerWallet_: string,
      mintlistSaleDuration_: BigNumberish,
      merkleRoot_: BytesLike,
      startingMetadataIndex_: BigNumberish,
      baseFolderHashWithoutQm_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addDomainsToSell(
      metadataUris: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    baseFolderHashWithoutQm(overrides?: CallOverrides): Promise<BigNumber>;

    controller(overrides?: CallOverrides): Promise<BigNumber>;

    domainMetadataUris(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    domainsPurchasedByAccount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    domainsSold(overrides?: CallOverrides): Promise<BigNumber>;

    getNftByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    mintlistMerkleRoot(overrides?: CallOverrides): Promise<BigNumber>;

    mintlistSaleDuration(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    parentDomainId(overrides?: CallOverrides): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    prefix(overrides?: CallOverrides): Promise<BigNumber>;

    purchaseDomains(
      count: BigNumberish,
      index: BigNumberish,
      purchaseLimit: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    releaseDomain(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    salePrice(overrides?: CallOverrides): Promise<BigNumber>;

    saleStartBlock(overrides?: CallOverrides): Promise<BigNumber>;

    saleStarted(overrides?: CallOverrides): Promise<BigNumber>;

    sellerWallet(overrides?: CallOverrides): Promise<BigNumber>;

    setBaseFolderHash(
      folderHashWithoutQm: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMerkleRoot(
      root: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setParentDomainId(
      parentId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPauseStatus(
      pauseStatus: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSaleDuration(
      durationInBlocks: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSalePrice(
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSellerWallet(
      wallet: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setStartIndex(
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    startSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    startingMetadataIndex(overrides?: CallOverrides): Promise<BigNumber>;

    stopSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    totalForSale(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    zNSRegistrar(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    __MintlistSimpleFolderIndexSale_init(
      controller_: string,
      parentDomainId_: BigNumberish,
      price_: BigNumberish,
      zNSRegistrar_: string,
      sellerWallet_: string,
      mintlistSaleDuration_: BigNumberish,
      merkleRoot_: BytesLike,
      startingMetadataIndex_: BigNumberish,
      baseFolderHashWithoutQm_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addDomainsToSell(
      metadataUris: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    baseFolderHashWithoutQm(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    controller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    domainMetadataUris(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    domainsPurchasedByAccount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    domainsSold(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getNftByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mintlistMerkleRoot(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mintlistSaleDuration(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    parentDomainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    prefix(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    purchaseDomains(
      count: BigNumberish,
      index: BigNumberish,
      purchaseLimit: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    releaseDomain(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    salePrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    saleStartBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    saleStarted(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    sellerWallet(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setBaseFolderHash(
      folderHashWithoutQm: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMerkleRoot(
      root: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setParentDomainId(
      parentId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPauseStatus(
      pauseStatus: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSaleDuration(
      durationInBlocks: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSalePrice(
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSellerWallet(
      wallet: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setStartIndex(
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    startSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    startingMetadataIndex(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stopSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    totalForSale(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    zNSRegistrar(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
