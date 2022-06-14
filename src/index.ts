import { ethers } from "ethers";

import {
  getAirWild2SaleContract,
  getClaimContract,
  getClaimingToken as getClaimingToken,
} from "./contracts";
import * as airWildS2Actions from "./actions/airWildS2Sale";
import * as claimWithChildSaleActions from "./actions/claimWithChildSale";
import {
  Claim,
  ClaimSaleConfig,
  AirWildS2Config,
  AirWildS2Instance,
  Maybe,
  AirWildS2SaleData,
  SaleStatus,
  Mintlist,
  ClaimWithChildInstance,
  ClaimWithChildSaleData,
} from "./types";

export * from "./types";

const defaultPublicSalePurchaseLimit = 100;

export const createAirWild2SaleInstance = (
  config: AirWildS2Config
): AirWildS2Instance => {
  let cachedMintlist: Maybe<Mintlist>;

  const getMintlist = async () => {
    if (cachedMintlist) {
      return cachedMintlist;
    }
    const mintlist = await airWildS2Actions.getMintlist(config);
    cachedMintlist = mintlist;

    return mintlist;
  };

  const instance: AirWildS2Instance = {
    getSalePrice: async (): Promise<string> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const price = await contract.salePrice();
      return ethers.utils.formatEther(price).toString();
    },
    getSaleData: async (): Promise<AirWildS2SaleData> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );

      // always eth sales currently
      const saleData: AirWildS2SaleData = await airWildS2Actions.getSaleData(
        contract,
        true
      );
      return saleData;
    },
    getSaleStartBlock: async (): Promise<string> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const startBlock = await contract.saleStartBlock();
      return startBlock.toString();
    },
    getSaleStatus: async (): Promise<SaleStatus> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const status: SaleStatus = await airWildS2Actions.getSaleStatus(contract);
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
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const duration = await contract.mintlistDurations(
        await contract.currentMerkleRootIndex()
      );
      return duration;
    },
    getTotalForSale: async (): Promise<ethers.BigNumber> => {
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );
      const total = await contract.totalForSale();

      return total;
    },
    getNumberOfDomainsSold: async (): Promise<ethers.BigNumber> => {
      const contract = await getAirWild2SaleContract(
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
      const contract = await getAirWild2SaleContract(
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
      const contract = await getAirWild2SaleContract(
        signer,
        config.contractAddress
      );

      const mintlist = await getMintlist();

      const tx = await airWildS2Actions.purchaseDomains(
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
      const contract = await getAirWild2SaleContract(
        signer,
        config.contractAddress
      );
      const tx = await airWildS2Actions.setPauseStatus(
        pauseStatus,
        contract,
        signer
      );
      return tx;
    },
    numberPurchasableByAccount: async (address: string): Promise<number> => {
      const mintlist = await getMintlist();
      const contract = await getAirWild2SaleContract(
        config.web3Provider,
        config.contractAddress
      );

      const amount = await airWildS2Actions.numberPurchasableByAccount(
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

export const createClaimWithChildInstance = (
  config: ClaimSaleConfig
): ClaimWithChildInstance => {
  const instance: ClaimWithChildInstance = {
    getSalePrice: async (): Promise<string> => {
      const contract = await getClaimContract(
        config.web3Provider,
        config.contractAddress
      );
      const price = await contract.salePrice();
      return ethers.utils.formatEther(price).toString();
    },
    getSaleData: async (): Promise<ClaimWithChildSaleData> => {
      const contract = await getClaimContract(
        config.web3Provider,
        config.contractAddress
      );

      // always eth sales currently
      const saleData: ClaimWithChildSaleData =
        await claimWithChildSaleActions.getSaleData(contract, true);
      return saleData;
    },
    getSaleStartBlock: async (): Promise<string> => {
      const contract = await getClaimContract(
        config.web3Provider,
        config.contractAddress
      );
      const startBlock = await contract.saleStartBlock();
      return startBlock.toString();
    },
    getSaleStatus: async (): Promise<SaleStatus> => {
      const contract = await getClaimContract(
        config.web3Provider,
        config.contractAddress
      );
      const status: SaleStatus = await claimWithChildSaleActions.getSaleStatus(
        contract
      );
      return status;
    },
    getSaleDuration: async (): Promise<ethers.BigNumber> => {
      const contract = await getClaimContract(
        config.web3Provider,
        config.contractAddress
      );
      const duration = await contract.saleDuration();
      return duration;
    },
    getTotalForSale: async (): Promise<ethers.BigNumber> => {
      const contract = await getClaimContract(
        config.web3Provider,
        config.contractAddress
      );
      const total = await contract.totalForSale();

      return total;
    },
    getNumberOfDomainsSold: async (): Promise<ethers.BigNumber> => {
      const contract = await getClaimContract(
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
    canBeClaimed: async (domainId: string): Promise<boolean> => {
      const contract = await getClaimContract(
        config.web3Provider,
        config.contractAddress
      );
      const claimingAddress = await contract.domainsClaimedWithBy(domainId);
      return claimingAddress == ethers.constants.AddressZero;
    },
    domainClaimedBy: async (domainId: string): Promise<string> => {
      const contract = await getClaimContract(
        config.web3Provider,
        config.contractAddress
      );
      const claimingAddress = await contract.domainsClaimedWithBy(domainId);
      return claimingAddress;
    },
    claimDomains: async (
      claimingIds: string[],
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getClaimContract(signer, config.contractAddress);

      const tx = await contract.claimDomains(claimingIds);
      return tx;
    },
    setPauseStatus: async (
      pauseStatus: boolean,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const contract = await getClaimContract(signer, config.contractAddress);
      const tx = await claimWithChildSaleActions.setPauseStatus(
        pauseStatus,
        contract,
        signer
      );
      return tx;
    },
    getClaimingIDsForUser: async (walletID: string): Promise<string[]> => {
      const claimingToken = await getClaimingToken(
        config.web3Provider,
        config.claimingRegistrarAddress
      );
      let childDomain: ethers.BigNumber;
      const claimingIDs: string[] = [];
      const bigNumDomainsOwned = await claimingToken.balanceOf(walletID);
      const numDomainsOwned = bigNumDomainsOwned.toNumber();
      if (numDomainsOwned != 0) {
        let i = 0;
        while (i < numDomainsOwned) {
          childDomain = await claimingToken.tokenOfOwnerByIndex(walletID, i);
          if (await instance.canBeClaimed(childDomain.toHexString())) {
            claimingIDs.push(childDomain.toHexString());
          }
        }
      }
      return claimingIDs;
    },
  };

  return instance;
};
