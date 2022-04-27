import { ethers } from "ethers";
import { AirWild2Sale } from "../contracts/types";

export const setPauseStatus = async (
  pauseStatus: boolean,
  saleContract: AirWild2Sale,
  signer: ethers.Signer
): Promise<ethers.ContractTransaction> => {
  const currentStatus = await saleContract.paused();
  if (pauseStatus === currentStatus) {
    throw Error("Execution would cause no state change");
  }

  const tx = await saleContract.connect(signer).setPauseStatus(pauseStatus);
  return tx;
};
