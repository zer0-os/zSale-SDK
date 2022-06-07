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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface ZNSHubInterface extends ethers.utils.Interface {
  functions: {
    "addController(address)": FunctionFragment;
    "addRegistrar(uint256,address)": FunctionFragment;
    "authorizedRegistrars(address)": FunctionFragment;
    "beacon()": FunctionFragment;
    "controllers(address)": FunctionFragment;
    "defaultRegistrar()": FunctionFragment;
    "domainCreated(uint256,string,uint256,uint256,address,address,string,uint256)": FunctionFragment;
    "domainExists(uint256)": FunctionFragment;
    "domainToContract(uint256)": FunctionFragment;
    "domainTransferred(address,address,uint256)": FunctionFragment;
    "getRegistrarForDomain(uint256)": FunctionFragment;
    "initialize(address,address)": FunctionFragment;
    "isController(address)": FunctionFragment;
    "metadataChanged(uint256,string)": FunctionFragment;
    "metadataLockChanged(uint256,address,bool)": FunctionFragment;
    "owner()": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "parentOf(uint256)": FunctionFragment;
    "registrarBeacon()": FunctionFragment;
    "removeController(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "royaltiesAmountChanged(uint256,uint256)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addController",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "addRegistrar",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "authorizedRegistrars",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "beacon", values?: undefined): string;
  encodeFunctionData(functionFragment: "controllers", values: [string]): string;
  encodeFunctionData(
    functionFragment: "defaultRegistrar",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "domainCreated",
    values: [
      BigNumberish,
      string,
      BigNumberish,
      BigNumberish,
      string,
      string,
      string,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "domainExists",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "domainToContract",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "domainTransferred",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegistrarForDomain",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isController",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "metadataChanged",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "metadataLockChanged",
    values: [BigNumberish, string, boolean]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "parentOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "registrarBeacon",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeController",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "royaltiesAmountChanged",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "addController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addRegistrar",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "authorizedRegistrars",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "beacon", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "controllers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultRegistrar",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "domainCreated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "domainExists",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "domainToContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "domainTransferred",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegistrarForDomain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "metadataChanged",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "metadataLockChanged",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "parentOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "registrarBeacon",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "royaltiesAmountChanged",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "EEDomainCreatedV2(address,uint256,string,uint256,uint256,address,address,string,uint256)": EventFragment;
    "EEMetadataChanged(address,uint256,string)": EventFragment;
    "EEMetadataLockChanged(address,uint256,address,bool)": EventFragment;
    "EENewSubdomainRegistrar(address,uint256,address)": EventFragment;
    "EERoyaltiesAmountChanged(address,uint256,uint256)": EventFragment;
    "EETransferV1(address,address,address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "EEDomainCreatedV2"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EEMetadataChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EEMetadataLockChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EENewSubdomainRegistrar"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EERoyaltiesAmountChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EETransferV1"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export class ZNSHub extends BaseContract {
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

  interface: ZNSHubInterface;

  functions: {
    addController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addRegistrar(
      rootDomainId: BigNumberish,
      registrar: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    authorizedRegistrars(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    beacon(overrides?: CallOverrides): Promise<[string]>;

    controllers(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    defaultRegistrar(overrides?: CallOverrides): Promise<[string]>;

    domainCreated(
      id: BigNumberish,
      label: string,
      labelHash: BigNumberish,
      parent: BigNumberish,
      minter: string,
      controller: string,
      metadataUri: string,
      royaltyAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    domainExists(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    domainToContract(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    domainTransferred(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getRegistrarForDomain(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    initialize(
      defaultRegistrar_: string,
      registrarBeacon_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isController(
      controller: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    metadataChanged(
      id: BigNumberish,
      uri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    metadataLockChanged(
      id: BigNumberish,
      locker: string,
      isLocked: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    ownerOf(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    parentOf(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    registrarBeacon(overrides?: CallOverrides): Promise<[string]>;

    removeController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    royaltiesAmountChanged(
      id: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addController(
    controller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addRegistrar(
    rootDomainId: BigNumberish,
    registrar: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  authorizedRegistrars(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  beacon(overrides?: CallOverrides): Promise<string>;

  controllers(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  defaultRegistrar(overrides?: CallOverrides): Promise<string>;

  domainCreated(
    id: BigNumberish,
    label: string,
    labelHash: BigNumberish,
    parent: BigNumberish,
    minter: string,
    controller: string,
    metadataUri: string,
    royaltyAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  domainExists(
    domainId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  domainToContract(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  domainTransferred(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getRegistrarForDomain(
    domainId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  initialize(
    defaultRegistrar_: string,
    registrarBeacon_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isController(controller: string, overrides?: CallOverrides): Promise<boolean>;

  metadataChanged(
    id: BigNumberish,
    uri: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  metadataLockChanged(
    id: BigNumberish,
    locker: string,
    isLocked: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  ownerOf(domainId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  parentOf(
    domainId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  registrarBeacon(overrides?: CallOverrides): Promise<string>;

  removeController(
    controller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  royaltiesAmountChanged(
    id: BigNumberish,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addController(controller: string, overrides?: CallOverrides): Promise<void>;

    addRegistrar(
      rootDomainId: BigNumberish,
      registrar: string,
      overrides?: CallOverrides
    ): Promise<void>;

    authorizedRegistrars(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    beacon(overrides?: CallOverrides): Promise<string>;

    controllers(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    defaultRegistrar(overrides?: CallOverrides): Promise<string>;

    domainCreated(
      id: BigNumberish,
      label: string,
      labelHash: BigNumberish,
      parent: BigNumberish,
      minter: string,
      controller: string,
      metadataUri: string,
      royaltyAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    domainExists(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    domainToContract(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    domainTransferred(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getRegistrarForDomain(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    initialize(
      defaultRegistrar_: string,
      registrarBeacon_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    isController(
      controller: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    metadataChanged(
      id: BigNumberish,
      uri: string,
      overrides?: CallOverrides
    ): Promise<void>;

    metadataLockChanged(
      id: BigNumberish,
      locker: string,
      isLocked: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    ownerOf(domainId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    parentOf(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registrarBeacon(overrides?: CallOverrides): Promise<string>;

    removeController(
      controller: string,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    royaltiesAmountChanged(
      id: BigNumberish,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    EEDomainCreatedV2(
      registrar?: null,
      id?: BigNumberish | null,
      label?: null,
      labelHash?: BigNumberish | null,
      parent?: BigNumberish | null,
      minter?: null,
      controller?: null,
      metadataUri?: null,
      royaltyAmount?: null
    ): TypedEventFilter<
      [
        string,
        BigNumber,
        string,
        BigNumber,
        BigNumber,
        string,
        string,
        string,
        BigNumber
      ],
      {
        registrar: string;
        id: BigNumber;
        label: string;
        labelHash: BigNumber;
        parent: BigNumber;
        minter: string;
        controller: string;
        metadataUri: string;
        royaltyAmount: BigNumber;
      }
    >;

    EEMetadataChanged(
      registrar?: null,
      id?: BigNumberish | null,
      uri?: null
    ): TypedEventFilter<
      [string, BigNumber, string],
      { registrar: string; id: BigNumber; uri: string }
    >;

    EEMetadataLockChanged(
      registrar?: null,
      id?: BigNumberish | null,
      locker?: null,
      isLocked?: null
    ): TypedEventFilter<
      [string, BigNumber, string, boolean],
      { registrar: string; id: BigNumber; locker: string; isLocked: boolean }
    >;

    EENewSubdomainRegistrar(
      parentRegistrar?: null,
      rootId?: null,
      childRegistrar?: null
    ): TypedEventFilter<
      [string, BigNumber, string],
      { parentRegistrar: string; rootId: BigNumber; childRegistrar: string }
    >;

    EERoyaltiesAmountChanged(
      registrar?: null,
      id?: BigNumberish | null,
      amount?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { registrar: string; id: BigNumber; amount: BigNumber }
    >;

    EETransferV1(
      registrar?: null,
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { registrar: string; from: string; to: string; tokenId: BigNumber }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;
  };

  estimateGas: {
    addController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addRegistrar(
      rootDomainId: BigNumberish,
      registrar: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    authorizedRegistrars(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    beacon(overrides?: CallOverrides): Promise<BigNumber>;

    controllers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    defaultRegistrar(overrides?: CallOverrides): Promise<BigNumber>;

    domainCreated(
      id: BigNumberish,
      label: string,
      labelHash: BigNumberish,
      parent: BigNumberish,
      minter: string,
      controller: string,
      metadataUri: string,
      royaltyAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    domainExists(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    domainToContract(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    domainTransferred(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getRegistrarForDomain(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      defaultRegistrar_: string,
      registrarBeacon_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isController(
      controller: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    metadataChanged(
      id: BigNumberish,
      uri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    metadataLockChanged(
      id: BigNumberish,
      locker: string,
      isLocked: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    parentOf(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registrarBeacon(overrides?: CallOverrides): Promise<BigNumber>;

    removeController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    royaltiesAmountChanged(
      id: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addRegistrar(
      rootDomainId: BigNumberish,
      registrar: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    authorizedRegistrars(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    beacon(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    controllers(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    defaultRegistrar(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    domainCreated(
      id: BigNumberish,
      label: string,
      labelHash: BigNumberish,
      parent: BigNumberish,
      minter: string,
      controller: string,
      metadataUri: string,
      royaltyAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    domainExists(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    domainToContract(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    domainTransferred(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getRegistrarForDomain(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      defaultRegistrar_: string,
      registrarBeacon_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isController(
      controller: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    metadataChanged(
      id: BigNumberish,
      uri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    metadataLockChanged(
      id: BigNumberish,
      locker: string,
      isLocked: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ownerOf(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    parentOf(
      domainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registrarBeacon(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    royaltiesAmountChanged(
      id: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
