import * as ethers from "ethers";
import { getSaleStatus } from ".";
import { WapeSale } from "../../contracts/types";
import { Claim, SaleStatus, Mintlist, Maybe } from "../../types";

const abi = ["function masterCopy() external view returns (address)"];

const errorCheck = async (condition: boolean, errorMessage: string) => {
  if (condition) {
    throw errorMessage;
  }
};

const generateAccessList = (
  userAddress: string,
  gnosisSafeProxyAddress: string,
  gnosisSafeImplAddress: string
) => {
  return [
    {
      address: gnosisSafeProxyAddress,
      storageKeys: [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ],
    },
    {
      address: gnosisSafeImplAddress,
      storageKeys: [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ],
    },
    {
      address: userAddress,
      storageKeys: [],
    },
  ];
};

export const purchaseDomains = async (
  count: ethers.BigNumber,
  signer: ethers.Signer,
  contract: WapeSale,
  mintlist: Mintlist
): Promise<ethers.ContractTransaction> => {
  const status = await getSaleStatus(contract);

  errorCheck(
    status === SaleStatus.NotStarted,
    "Cannot purchase a domain when sale has not started"
  );

  errorCheck(status === SaleStatus.Ended, "Sale has already ended");

  errorCheck(count.eq("0"), "Cannot purchase 0 domains");

  const paused = await contract.paused();
  errorCheck(paused, "Sale contract is paused");

  const domainsSold = await contract.domainsSold();
  const numberForSale = await contract.amountForSale();

  errorCheck(
    domainsSold.gte(numberForSale),
    "There are no domains left for purchase in the sale"
  );

  const address = await signer.getAddress();
  const balance = await signer.getBalance();
  const price = await contract.salePrice();

  errorCheck(
    balance.lt(price.mul(count)),
    `Not enough funds given for purchase of ${count} domains`
  );

  let userClaim: Maybe<Claim> = mintlist.claims[address];

  // To purchase in private sale a user must be on the mintlist
  errorCheck(userClaim === undefined, "User is not part of private sale");
  userClaim = userClaim!;

  // Sale is in private sale
  const purchased = await contract.domainsPurchasedByAccount(address);
  errorCheck(
    purchased.add(count).gt(userClaim.quantity),
    `Buying ${count} more domains would go over the maximum purchase amount of domains
    for this user, ${userClaim.quantity}. Try reducing the purchase amount.`
  );

  let accessList;
  try {
    // If using a Gnosis safe as the seller wallet you must
    // provide the implementation address for the tx accessList
    const sellerWallet = await contract.sellerWallet();

    const sellerContract = new ethers.Contract(
      sellerWallet,
      abi,
      contract.provider
    );
    const implAddress = await sellerContract.masterCopy();
    accessList = generateAccessList(address, sellerWallet, implAddress);
  } catch (e) {
    throw Error(
      `Unable to get accessList information for tx using user address: ${address}. Seller wallet may not be a contract.`
      );
  }

    const tx = await contract
      .connect(signer)
      .purchaseDomains(
        count,
        userClaim.index,
        userClaim.quantity,
        userClaim.proof,
        {
          value: price.mul(count),
          type: 2,
          accessList: accessList,
        }
      );
    return tx;
};
