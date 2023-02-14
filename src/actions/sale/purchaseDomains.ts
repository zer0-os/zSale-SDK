import * as ethers from "ethers";
import { getSaleStatus } from ".";
import { Sale, WapeSale } from "../../contracts/types";
import { isTransitionToPublicPhasePending } from "../../helpers";
import { Claim, SaleStatus, Mintlist, Maybe, SalePhase } from "../../types";

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
  mintlist: Mintlist,
): Promise<ethers.ContractTransaction> => {
  const status: SalePhase =
    (await contract.salePhase()) as SalePhase;

  errorCheck(
    status === SalePhase.Inactive || status === SalePhase.ReadyForNewSale,
    "Cannot purchase domains: Sale prepared but not yet started"
  );

  errorCheck(status === SalePhase.Inactive, "Cannot purchase domains: No sale in progress");

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
  const saleStartTime = await (await contract.saleStartBlockTimestamp()).toNumber();
  const privateSaleDuration = saleConfiguration.mintlistSaleDuration.toNumber();
  // TODO implement isPublicTransitionPending function, 
  // update logic here to use private price when necessary
  // add a get current price of domain function
  // 

  errorCheck(
    balance.lt(price.mul(count)),
    `Not enough funds given for purchase of ${count} domains`
  );

  let accessList;
  try {
    // If using a Gnosis safe as the seller wallet you must
    // provide the implementation address for the tx accessList
    const sellerWallet = saleConfiguration.sellerWallet

    const sellerContract = new ethers.Contract(
      sellerWallet,
      abi,
      contract.provider
    );
    const implAddress = await sellerContract.masterCopy();
    accessList = generateAccessList(address, sellerWallet, implAddress);
  } catch (e) {
    // We should not be attempting to use accessList at this point, as this is not supported by metamask:
    // https://github.com/MetaMask/metamask-extension/issues/11863
    //
    // I would prefer to just remove this whole block at the moment, but in the interest of introducing minimal
    // last minute changes, will leave as-is.
    //
    // If you are copying this for future use, DO NOT USE accessList without first verifying that support
    // has been added to metamask!
    // - Joel Tulloch
    // TODO parking lot with Joel
  }

  let tx: ethers.ContractTransaction;
  const purchased = await contract.domainsPurchasedByAccountPerSale(saleId, address);
  const currentBlock = await contract.provider.getBlock("latest");

  if (status === SalePhase.Private && !isTransitionToPublicPhasePending(saleStartTime, privateSaleDuration, currentBlock)) {
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
      .purchaseDomainsPrivateSale(
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
          value: price.mul(count),
          type: 2,
          accessList: accessList,
        }
      );
  }
  return tx;
};
