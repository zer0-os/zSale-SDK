import * as ethers from "ethers";
import { Sale } from "../../contracts/types";
import { isTransitionToPublicPhasePending } from "../../helpers";
import { Claim, Mintlist, Maybe, SalePhase } from "../../types";

const abi = ["function masterCopy() external view returns (address)"];

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
  contract: Sale,
  mintlist: Mintlist
): Promise<ethers.ContractTransaction> => {
  const status: SalePhase = await contract.salePhase();

  if (status === SalePhase.ReadyForNewSale) {
    throw new Error(
      "Cannot purchase domains: Sale prepared but not yet started"
    );
  }

  if (status === SalePhase.Inactive) {
    throw new Error("Cannot purchase domains: No sale in progress");
  }

  if (count.eq("0")) {
    throw new Error("Cannot purchase 0 domains");
  }

  const paused = await contract.paused();
  if (paused) {
    throw new Error("Sale contract is paused");
  }

  const domainsSold = await contract.domainsSold();
  const saleConfiguration = await contract.saleConfiguration();
  const numberForSale = saleConfiguration.amountForSale.toNumber();

  if (domainsSold.gte(numberForSale)) {
    throw new Error("There are no domains left for purchase in the sale");
  }

  const address = await signer.getAddress();
  const balance = await signer.getBalance();
  const saleId = await contract.saleId();
  const price = saleConfiguration.salePrice;
  const privatePrice = saleConfiguration.privateSalePrice;
  const saleStartTime = (await contract.saleStartBlockTimestamp()).toNumber();
  const privateSaleDuration = saleConfiguration.mintlistSaleDuration.toNumber();

  let tx: ethers.ContractTransaction;
  const purchased = await contract.domainsPurchasedByAccountPerSale(
    saleId,
    address
  );
  const currentBlock = await contract.provider.getBlock("latest");

  if (
    status === SalePhase.Private &&
    !isTransitionToPublicPhasePending(
      saleStartTime,
      privateSaleDuration,
      currentBlock
    )
  ) {
    let userClaim: Maybe<Claim> = mintlist.claims[address];

    // To purchase in private sale a user must be on the mintlist
    userClaim = userClaim!;
    if (userClaim === undefined) {
      throw new Error("User is not part of private sale");
    }

    // Cannot purchase over the allowed mintlist limit

    if (purchased.add(count).gt(userClaim.quantity)) {
      throw new Error(`This user has already purchased ${purchased.toString()} and buying ${count.toString()} more domains would go over the
      maximum purchase amount of domains for this user, ${
        userClaim.quantity
      }. Try reducing the purchase amount.`);
    }
    if (balance.lt(privatePrice.mul(count))) {
      throw new Error(
        `Not enough funds given for purchase of ${count} domains`
      );
    }

    tx = await contract
      .connect(signer)
      .purchaseDomainsPrivateSale(
        count,
        userClaim.index,
        userClaim.quantity,
        userClaim.proof
      );
  } else {
    // Public sale
    const publicSaleLimit = saleConfiguration.publicSaleLimit.toNumber();

    if (balance.lt(price.mul(count))) {
      throw new Error(
        `Not enough funds given for purchase of ${count} domains`
      );
    }
    if (purchased.add(count).gt(publicSaleLimit)) {
      throw new Error(`This user has already purchased ${purchased.toString()} and buying ${count.toString()} more domains would go over the 
        maximum purchase amount for the public sale limit of ${publicSaleLimit.toString()}. Try reducing the purchase amount.`);
    }

    tx = await contract.connect(signer).purchaseDomainsPublicSale(count, {
      value: price.mul(count),
      type: 2,
    });
  }
  return tx;
};
