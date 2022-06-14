import { ethers } from "ethers";
import { ClaimWithChildSale } from "../../contracts/types/ClaimWithChildSale";

export const setPauseStatus = async (
  pauseStatus: boolean,
  saleContract: ClaimWithChildSale,
  signer: ethers.Signer
): Promise<ethers.ContractTransaction> => {
  const currentStatus = await saleContract.paused();
  if (pauseStatus === currentStatus) {
    throw Error("Execution would cause no state change");
  }

  const tx = await saleContract.connect(signer).setPauseStatus(pauseStatus);
  return tx;
};
