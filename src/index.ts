import { ethers } from "ethers";

import { getSaleContract, getWapeSaleContract } from "./contracts";
import * as wapeSaleActions from "./actions/wapeSale";
import * as saleActions from "./actions/sale";
import {
  Claim,
  Maybe,
  SaleStatus,
  Mintlist,
  WapeSaleConfig,
  WapeSaleInstance,
  WapeSaleData,
  SaleContractConfig,
  SaleInstance,
  PriceInfo,
  SaleData,
  SalePhase,
} from "./types";

export * from "./types";

const defaultPublicSalePurchaseLimit = 100;

export const createWapeSaleInstance = (
  config: WapeSaleConfig
): WapeSaleInstance => {
  let cachedMintlist: Maybe<Mintlist>;

  const getMintlist = async () => {
    if (cachedMintlist) {
      return cachedMintlist;
    }
    const mintlist = await wapeSaleActions.getMintlist(config);
    cachedMintlist = mintlist;

    return mintlist;
  };

  const instance: WapeSaleInstance = {
    getSalePrice: async (): Promise<string> => {
      const contract = await getWapeSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const price = await contract.salePrice();
      return ethers.utils.formatEther(price).toString();
    },
    getSaleData: async (): Promise<WapeSaleData> => {
      const contract = await getWapeSaleContract(
        config.web3Provider,
        config.contractAddress
      );

      // always eth sales currently
      const saleData: WapeSaleData = await wapeSaleActions.getSaleData(
        contract,
        true
      );
      return saleData;
    },
    getSaleStartBlock: async (): Promise<string> => {
      const contract = await getWapeSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const startBlock = await contract.saleStartBlock();
      return startBlock.toString();
    },
    getSaleStatus: async (): Promise<SaleStatus> => {
      const contract = await getWapeSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const status: SaleStatus = await wapeSaleActions.getSaleStatus(contract);
      return status;
    },
    getMintlist: async (): Promise<Mintlist> => {
      const whitelist = await getMintlist();
      return whitelist;
    },
    getMintlistedUserClaim: async (address: string): Promise<Claim> => {
      const mintlist = await getMintlist();
      const userClaim: Maybe<Claim> = mintlist.claims[address];
      if (!userClaim) {
        throw Error(
          `No claim could be found for user ${address} because they are not on the whitelist`
        );
      }
      return userClaim;
    },
    getSaleMintlistDuration: async (): Promise<ethers.BigNumber> => {
      const contract = await getWapeSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const duration = await contract.mintlistSaleDuration();
      return duration;
    },
    getTotalForSale: async (): Promise<ethers.BigNumber> => {
      const contract = await getWapeSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const total = await contract.amountForSale();

      return total;
    },
    getNumberOfDomainsSold: async (): Promise<ethers.BigNumber> => {
      const contract = await getWapeSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const domainsSold = await contract.domainsSold();
      return domainsSold;
    },
    getBlockNumber: async (): Promise<number> => {
      const blockNum = await config.web3Provider.getBlockNumber();
      return blockNum;
    },
    getEthBalance: async (address: string): Promise<string> => {
      const balance = await config.web3Provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    },
    isUserOnMintlist: async (address: string): Promise<boolean> => {
      const mintlist = await getMintlist();
      const isOnWhitelist = mintlist.claims[address] ? true : false;
      return isOnWhitelist;
    },
    getDomainsPurchasedByAccount: async (address: string): Promise<number> => {
      const contract = await getWapeSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const domains = await contract.domainsPurchasedByAccount(address);
      return domains.toNumber();
    },
    purchaseDomains: async (
      count: ethers.BigNumber,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getWapeSaleContract(
        signer,
        config.contractAddress
      );

      const mintlist = await getMintlist();

      const tx = await wapeSaleActions.purchaseDomains(
        count,
        signer,
        contract,
        mintlist
      );
      return tx;
    },
    setPauseStatus: async (
      pauseStatus: boolean,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getWapeSaleContract(
        signer,
        config.contractAddress
      );
      const tx = await wapeSaleActions.setPauseStatus(
        pauseStatus,
        contract,
        signer
      );
      return tx;
    },
    numberPurchasableByAccount: async (address: string): Promise<number> => {
      const mintlist = await getMintlist();
      const contract = await getWapeSaleContract(
        config.web3Provider,
        config.contractAddress
      );

      const amount = await wapeSaleActions.numberPurchasableByAccount(
        mintlist,
        contract,
        address,
        config.publicSalePurchaseLimit ?? defaultPublicSalePurchaseLimit
      );

      return amount;
    },
  };

  return instance;
};

export const createSaleInstance = (
  config: SaleContractConfig
): SaleInstance => {
  let cachedMintlist: Maybe<Mintlist>;

  const getMintlist = async () => {
    if (cachedMintlist) {
      return cachedMintlist;
    }
    const mintlist = await wapeSaleActions.getMintlist(config);
    cachedMintlist = mintlist;

    return mintlist;
  };

  const instance: SaleInstance = {
    getSalePrice: async (): Promise<PriceInfo> => {
      const contract = await getSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const saleConfig = await contract.saleConfiguration();
      const publicPrice = saleConfig.salePrice;
      const privatePrice = saleConfig.privateSalePrice;
      const priceInfo = {
        publicPrice: ethers.utils.formatEther(publicPrice).toString(),
        privatePrice: ethers.utils.formatEther(privatePrice).toString(),
      };

      return priceInfo;
    },
    getSaleData: async (): Promise<SaleData> => {
      const contract = await getSaleContract(
        config.web3Provider,
        config.contractAddress
      );

      // always eth sales currently
      const saleData: SaleData = await saleActions.getSaleData(contract);
      return saleData;
    },
    getSaleStartTime: async (): Promise<string> => {
      const contract = await getSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const startBlock = await contract.saleStartBlockTimestamp();
      return startBlock.toString();
    },
    getSaleStatus: async (): Promise<SalePhase> => {
      const contract = await getSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const status: SalePhase = await saleActions.getSaleStatus(contract);
      return status;
    },
    getMintlist: async (): Promise<Mintlist> => {
      const whitelist = await getMintlist();
      return whitelist;
    },
    getMintlistedUserClaim: async (address: string): Promise<Claim> => {
      const mintlist = await getMintlist();
      const userClaim: Maybe<Claim> = mintlist.claims[address];
      if (!userClaim) {
        throw Error(
          `No claim could be found for user ${address} because they are not on the whitelist`
        );
      }
      return userClaim;
    },
    getSaleMintlistDuration: async (): Promise<ethers.BigNumber> => {
      const contract = await getSaleContract(
        config.web3Provider,
        config.contractAddress
      );

      const saleConfig = await contract.saleConfiguration();
      return saleConfig.mintlistSaleDuration;
    },
    getTotalForSale: async (): Promise<ethers.BigNumber> => {
      const contract = await getSaleContract(
        config.web3Provider,
        config.contractAddress
      );

      const saleConfig = await contract.saleConfiguration();

      return saleConfig.amountForSale;
    },
    getNumberOfDomainsSold: async (): Promise<ethers.BigNumber> => {
      const contract = await getSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const domainsSold = await contract.domainsSold();
      return domainsSold;
    },
    getBlockNumber: async (): Promise<number> => {
      const blockNum = await config.web3Provider.getBlockNumber();
      return blockNum;
    },
    getEthBalance: async (address: string): Promise<string> => {
      const balance = await config.web3Provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    },
    isUserOnMintlist: async (address: string): Promise<boolean> => {
      const mintlist = await getMintlist();
      const isOnWhitelist = mintlist.claims[address] ? true : false;
      return isOnWhitelist;
    },
    getDomainsPurchasedByAccountForSale: async (
      activeSaleId: number,
      address: string
    ): Promise<number> => {
      const contract = await getSaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const domains = await contract.domainsPurchasedByAccountPerSale(
        activeSaleId,
        address
      );
      return domains.toNumber();
    },
    purchaseDomains: async (
      count: ethers.BigNumber,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getSaleContract(signer, config.contractAddress);

      const mintlist = await getMintlist();

      const tx = await saleActions.purchaseDomains(
        count,
        signer,
        contract,
        mintlist
      );
      return tx;
    },
    setPauseStatus: async (
      pauseStatus: boolean,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getSaleContract(signer, config.contractAddress);
      const tx = await saleActions.setPauseStatus(
        pauseStatus,
        contract,
        signer
      );
      return tx;
    },
    numberPurchasableByAccount: async (address: string): Promise<number> => {
      const mintlist = await getMintlist();
      const contract = await getSaleContract(
        config.web3Provider,
        config.contractAddress
      );

      // TODO-REQ confirm requirements
      const amount = await saleActions.numberPurchasableByAccount(
        mintlist,
        contract,
        address,
        config.publicSalePurchaseLimit ?? defaultPublicSalePurchaseLimit
      );

      return amount;
    },
  };

  return instance;
};
