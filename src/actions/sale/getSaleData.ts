import { ethers } from "ethers";
import { SalePhases } from "../../constants";
import { Sale } from "../../contracts/types";
import { SaleConfiguration, SaleData, SalePhase } from "../../types";

export const getSaleData = async (contract: Sale): Promise<SaleData> => {
  const salePhase: SalePhase = (await contract.salePhase()) as SalePhase;
  const salePhaseName = SalePhases[salePhase];
  const saleStartTime = (await contract.saleStartBlockTimestamp()).toNumber();
  const saleId = (await contract.saleId()).toString();
  const saleCounter = (await contract.saleCounter()).toNumber();
  const saleConfigurationRaw = await contract.saleConfiguration();

  const saleConfiguration: SaleConfiguration = {
    sellerWallet: saleConfigurationRaw.sellerWallet.toString(),
    parentDomainId: saleConfigurationRaw.parentDomainId.toHexString(),
    publicSalePrice: ethers.utils.formatEther(saleConfigurationRaw.salePrice),
    privateSalePrice: ethers.utils.formatEther(
      saleConfigurationRaw.privateSalePrice
    ),
    mintlistSaleDuration: saleConfigurationRaw.mintlistSaleDuration.toNumber(),
    amountForSale: saleConfigurationRaw.amountForSale.toNumber(),
    mintlistMerkleRoot: saleConfigurationRaw.mintlistMerkleRoot.toString(),
    startingMetadataIndex:
      saleConfigurationRaw.startingMetadataIndex.toNumber(),
    folderGroupID: saleConfigurationRaw.folderGroupID.toNumber(),
    publicSaleLimit: saleConfigurationRaw.publicSaleLimit.toNumber(),
  };

  const saleData: SaleData = {
    saleId: saleId,
    salePhaseName: salePhaseName,
    saleConfiguration: saleConfiguration,
    saleStartTime: saleStartTime,
    saleCounter: saleCounter,
    salePhase: salePhase,
  };

  return saleData;
};
