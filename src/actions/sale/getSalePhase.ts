import { Sale } from "../../contracts/types";
import { isTransitionToPublicPhasePending } from "../../helpers";
import { SalePhase, SaleStatus } from "../../types";

/**
 * Determines the phase of the current sale using the contract + last block timestamp
 * @param contract 
 * @returns 
 */
export const getSaleStatus = async (contract: Sale): Promise<SalePhase> => {
  const salePhase = await contract.salePhase();

  if (salePhase === SalePhase.ReadyForNewSale) {
    return SalePhase.ReadyForNewSale;
  }
  if (salePhase === SalePhase.Inactive) {
    return SalePhase.Inactive
  }

  const saleDataPromises = [
    contract.domainsSold(),
    contract.saleStartBlockTimestamp(),
  ];

  const [
    numSold,
    startTimeRaw
  ] = await Promise.all(saleDataPromises)

  const saleConfiguration = await contract.saleConfiguration()
  const privateSaleDuration = saleConfiguration.mintlistSaleDuration.toNumber();
  const amountForSale = saleConfiguration.amountForSale.toNumber();
  const startTime = startTimeRaw.toNumber();

  // PR - sale is technically still active here, owner could add more for sale, but for zApp purposes they may want to display the sale as over.
  if (numSold.gte(amountForSale)) {
    return SalePhase.Inactive;
  } 
  
  const currentBlock = await contract.provider.getBlock("latest");
  const pendingPublicTransition = await isTransitionToPublicPhasePending(startTime, privateSaleDuration, currentBlock);

  if (pendingPublicTransition) {
    return SalePhase.Public;
  }

  return SalePhase.Private;
};
