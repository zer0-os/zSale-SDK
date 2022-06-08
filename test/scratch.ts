import { ethers } from "ethers";

import * as sdk from "../src";

require("dotenv").config();

const main = async () => {
  const wallet = new ethers.Wallet(
    process.env.TESTNET_PRIVATE_KEY!,
    new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/77c3d733140f4c12a77699e24cb30c27"
    )
  );
  const config: sdk.AirWildS2Config = {
    web3Provider: wallet.provider,
    merkleTreeFileUri:
      "https://ipfs.io/ipfs/QmSarejrKPohT6peSHAWwLDkfBhy8qwEouFhBMzzw2vCit",
    contractAddress: "0x86d879a4788B9e5D3D166BcD7210F967c1182Dab",
  };

  const instance = sdk.createInstance(config);

  const data = await instance.getSaleData();
  console.log(data);

  console.log(await instance.getSaleStatus());

  await instance.purchaseDomains(ethers.BigNumber.from(1), wallet);
};

main().catch(console.error);
