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

  for (const chunk of chunks) {
    await Promise.all(chunk);
    await delay(delayTime);
  }
}
