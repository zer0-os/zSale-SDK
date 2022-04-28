import { ethers } from "ethers";

import * as sdk from "../src";
import { SaleStatus } from "../src";

require("dotenv").config();

const main = async () => {
  const wallet = new ethers.Wallet(
    process.env.TESTNET_PRIVATE_KEY!,
    new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/77c3d733140f4c12a77699e24cb30c27"
    )
  );
  const config: sdk.Config = {
    web3Provider: new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/77c3d733140f4c12a77699e24cb30c27"
    ),
    contractAddress: "0x9e903BB3c48BC2b679B20959F365c0be7Ab88961",
    merkleTreeFileUris: [
      "https://ipfs.io/ipfs/QmXQLJN49XRAgdgeJ8Hz6zf7izQGokPnQ5MZ6p79m2avpk",
      "https://ipfs.io/ipfs/QmXn7C5GrzHU8tgdGRT1g25WQe1rrvrfy1rEWjw6Cjm5sL",
    ],
    advanced: {
      merkleTreeFileIPFSHashes: [
        "QmXQLJN49XRAgdgeJ8Hz6zf7izQGokPnQ5MZ6p79m2avpk",
        "QmXn7C5GrzHU8tgdGRT1g25WQe1rrvrfy1rEWjw6Cjm5sL",
      ],
    },
  };

  const instance = sdk.createInstance(config);

  const data = await instance.getSaleData();
  console.log(data);

  console.log((await instance.getSaleStatus()) as SaleStatus);
  console.log("num sold = " + (await instance.getNumberOfDomainsSold()));
  console.log("totalForSale = " + (await instance.getTotalForSale()));

  const currentMintlist = (await instance.getSaleMintlistDuration()).toNumber();
  const duration = await contract.mintlistDurations(currentMintlist);
};

main().catch(console.error);
