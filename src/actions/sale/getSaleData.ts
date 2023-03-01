import { ethers } from "ethers";
import { SalePhases } from "../../constants";
import { Sale } from "../../contracts/types";
import { SaleConfiguration, SaleData, SalePhase } from "../../types";

export const getSaleData = async (contract: Sale): Promise<SaleData> => {
  const salePhase: SalePhase = (await contract.salePhase()) as SalePhase;
  const salePhaseName = SalePhases[salePhase];
  const saleStartTime = await contract.saleStartBlockTimestamp();
  const saleId = (await contract.saleId()).toString();
  const saleCounter = await contract.saleCounter();
  const saleConfigurationRaw = await contract.saleConfiguration();
  const amountSold = await contract.domainsSold();

  const saleConfiguration: SaleConfiguration = {
    amountSold: amountSold,
    sellerWallet: saleConfigurationRaw.sellerWallet.toString(),
    parentDomainId: saleConfigurationRaw.parentDomainId.toHexString(),
    publicSalePrice: ethers.utils.formatEther(saleConfigurationRaw.salePrice),
    privateSalePrice: ethers.utils.formatEther(
      saleConfigurationRaw.privateSalePrice
    ),
    mintlistSaleDurationSeconds:
      saleConfigurationRaw.mintlistSaleDuration.toNumber(),
    amountForSale: saleConfigurationRaw.amountForSale,
    mintlistMerkleRoot: saleConfigurationRaw.mintlistMerkleRoot.toString(),
    startingMetadataIndex: saleConfigurationRaw.startingMetadataIndex,
    folderGroupID: saleConfigurationRaw.folderGroupID,
    publicSaleLimit: saleConfigurationRaw.publicSaleLimit,
  };

  const saleData: SaleData = {
    saleId: saleId,
    salePhaseName: salePhaseName,
    saleConfiguration: saleConfiguration,
    saleStartTimeSeconds: saleStartTime.toNumber(),
    saleCounter: saleCounter.toNumber(),
    salePhase: salePhase,
  };

  return saleData;
};
