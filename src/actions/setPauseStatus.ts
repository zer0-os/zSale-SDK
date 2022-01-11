import { ethers } from "ethers";
import { WhiteListSimpleSale } from "../contracts/types";

export const setPauseStatus = async (
  pauseStatus: boolean,
  saleContract: WhiteListSimpleSale
): Promise<ethers.ContractTransaction> => {
  const currentStatus = await saleContract.paused();
  if (pauseStatus === currentStatus)
    throw Error("Execution would cause no state change");

  const tx = await saleContract.setPauseStatus(pauseStatus);
  return tx;
}
