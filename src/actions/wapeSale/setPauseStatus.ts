import { ethers } from "ethers";
import { WapeSale } from "../../contracts/types";

export const setPauseStatus = async (
  pauseStatus: boolean,
  saleContract: WapeSale,
  signer: ethers.Signer
): Promise<ethers.ContractTransaction> => {
  const currentStatus = await saleContract.paused();
  if (pauseStatus === currentStatus) {
    throw Error("Execution would cause no state change");
  }

  const tx = await saleContract.connect(signer).setPauseStatus(pauseStatus);
  return tx;
};
