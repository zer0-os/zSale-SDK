import { ethers } from "ethers";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const chunkArray = <T>(array: T[], chunk_size: number) =>
  Array(Math.ceil(array.length / chunk_size))
    .fill(null)
    .map((_, index) => index * chunk_size)
    .map((begin) => array.slice(begin, begin + chunk_size));

export async function chunkedPromiseAll<T>(
  promises: Promise<T>[],
  chunkSize = 100,
  delayTime = 0
) {
  const chunks = chunkArray(promises, chunkSize);
  const result: T[][] = [];

  for (const chunk of chunks) {
    if (result.length != 0) {
      await delay(delayTime);
    }
    result.push(await Promise.all(chunk));
  }

  return result.flat();
}

export function padZeros(hex: string) {
  if (hex.length == 66)
    // already the correct length
    return hex;

  const hexAsUint8 = ethers.utils.arrayify(hex);
  const paddedArray = ethers.utils.zeroPad(hexAsUint8, 32);
  const rehexed = ethers.utils.hexlify(paddedArray);
  return rehexed;
}

export function errorCheck(condition: boolean, errorMessage: string) {
  if (condition) {
    throw new Error(errorMessage);
  }
};