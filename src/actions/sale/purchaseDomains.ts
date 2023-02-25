import * as ethers from "ethers";
import { Sale } from "../../contracts/types";
import { isTransitionToPublicPhasePending } from "../../helpers";
import { Claim, Mintlist, Maybe, SalePhase } from "../../types";

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
  contract: Sale,
  mintlist: Mintlist
): Promise<ethers.ContractTransaction> => {
  const status: SalePhase = (await contract.salePhase()) as SalePhase;

  errorCheck(
    status === SalePhase.ReadyForNewSale,
    "Cannot purchase domains: Sale prepared but not yet started"
  );

  errorCheck(
    status === SalePhase.Inactive,
    "Cannot purchase domains: No sale in progress"
  );

  errorCheck(count.eq("0"), "Cannot purchase 0 domains");

  const paused = await contract.paused();
  errorCheck(paused, "Sale contract is paused");

  const domainsSold = await contract.domainsSold();
  const saleConfiguration = await contract.saleConfiguration();
  const numberForSale = saleConfiguration.amountForSale.toNumber();

  errorCheck(
    domainsSold.gte(numberForSale),
    "There are no domains left for purchase in the sale"
  );

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
    errorCheck(userClaim === undefined, "User is not part of private sale");
    userClaim = userClaim!;

    // Cannot purchase over the allowed mintlist limit
    errorCheck(
      purchased.add(count).gt(userClaim.quantity),
      `This user has already purchased ${purchased.toString()} and buying ${count.toString()} more domains would go over the
      maximum purchase amount of domains for this user, ${
        userClaim.quantity
      }. Try reducing the purchase amount.`
    );
    errorCheck(
      balance.lt(privatePrice.mul(count)),
      `Not enough funds given for purchase of ${count} domains`
    );

    tx = await contract
      .connect(signer)
      .purchaseDomainsPrivateSale(
        count,
        userClaim.index,
        userClaim.quantity,
        userClaim.proof,
      );
  } else {
    // Public sale
    const publicSaleLimit = await contract.publicSaleLimit();

    errorCheck(
      balance.lt(price.mul(count)),
      `Not enough funds given for purchase of ${count} domains`
    );
    errorCheck(
      purchased.add(count).gt(publicSaleLimit),
      `This user has already purchased ${purchased.toString()} and buying ${count.toString()} more domains would go over the
      maximum purchase amount for the public sale limit of ${publicSaleLimit.toString()}. Try reducing the purchase amount.`
    );

    tx = await contract.connect(signer).purchaseDomainsPublicSale(count, {
      value: price.mul(count),
      type: 2,
    });
  }
  return tx;
};
