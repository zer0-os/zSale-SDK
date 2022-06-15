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
  const config: sdk.ClaimSaleConfig = {
    web3Provider: new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/77c3d733140f4c12a77699e24cb30c27"
    ),
    contractAddress: "0x0cda74723a9945977df45268394dff7989e0265b",
    claimingRegistrarAddress: "0x06b3fb925b342411fc7420fdc7bd5433f7a7261b",
  };

  console.log(config);

  const instance = sdk.createClaimWithChildInstance(config);

  const data = await instance.getClaimingIDsForUser(
    "0x35888AD3f1C0b39244Bb54746B96Ee84A5d97a53"
  );
  console.log(data);

  // const duration = await contract.mintlistDurations(currentMintlist);
};

main().catch(console.error);
