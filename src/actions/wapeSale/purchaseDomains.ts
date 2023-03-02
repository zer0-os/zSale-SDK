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

  let tx: ethers.ContractTransaction;
  const purchased = await contract.domainsPurchasedByAccount(address);

  if (status === SaleStatus.PrivateSale) {
    let userClaim: Maybe<Claim> = mintlist.claims[address];

    // To purchase in private sale a user must be on the mintlist
    errorCheck(userClaim === undefined, "User is not part of private sale");
    userClaim = userClaim!;

    // Cannot purchase over the allowed mintlist limit
    errorCheck(
      purchased.add(count).gt(userClaim.quantity),
      `This user has already purchased ${purchased.toString()} and buying ${count.toString()} more domains would go over the
      maximum purchase amount of domains for this user, ${userClaim.quantity}. Try reducing the purchase amount.`
    );
    tx = await contract
      .connect(signer)
      .purchaseDomains(
        count,
        userClaim.index,
        userClaim.quantity,
        userClaim.proof,
        {
          value: price.mul(count)
        }
      );
  } else {
    // Public sale
    const publicSaleLimit = await contract.publicSaleLimit();

    errorCheck(
      purchased.add(count).gt(publicSaleLimit),
      `This user has already purchased ${purchased.toString()} and buying ${count.toString()} more domains would go over the
      maximum purchase amount for the public sale limit of ${publicSaleLimit.toString()}. Try reducing the purchase amount.`
    );
    tx = await contract
      .connect(signer)
      .purchaseDomainsPublicSale(
        count,
        {
          value: price.mul(count)
        }
      );
  }
  return tx;
};
