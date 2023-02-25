import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { createWapeSaleInstance } from "../src";
import {
} from "../src/contracts";
import {
  WapeSaleConfig,
  WapeSaleInstance,
} from "../src/types";

const expect = chai.expect;
chai.use(chaiAsPromised.default);
dotenv.config();

describe("Sale SDK", () => {
// TODO
});
