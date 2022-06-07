import * as ethers from "ethers";
import { getSaleStatus } from ".";
import { ClaimWithChildSale } from "../../contracts/types/ClaimWithChildSale";
import { ZNSHub__factory } from "../../contracts/types/factories/ZNSHub__factory";
import { SaleStatus, Maybe } from "../../types";

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

export const claimDomains = async (
  claimingIds: string[],
  signer: ethers.Signer,
  contract: ClaimWithChildSale
): Promise<ethers.ContractTransaction> => {
  const maxClaimsAtOnce = 10;
  errorCheck(
    claimingIds.length > maxClaimsAtOnce,
    `Too many claims at once - please claim with ${maxClaimsAtOnce} domains or fewer`
  );

  const status = await getSaleStatus(contract);

  errorCheck(
    status === SaleStatus.NotStarted,
    "Cannot claim a domain when sale has not started or has ended"
  );

  errorCheck(status === SaleStatus.Ended, "Sale has already ended");

  const count = claimingIds.length;

  errorCheck(count == 0, "Cannot claim 0 domains");

  const paused = await contract.paused();
  errorCheck(paused, "Claim contract is paused");

  const domainsSold = await contract.domainsSold();
  const numberForSale = await contract.totalForSale();

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

  // ensure that IDs are claimable
  // IDs have not been claimed yet
  for (const claimingId in claimingIds) {
    // the user owns it
    const hubAddress = await contract.zNSHub();
    const hub = ZNSHub__factory.connect(hubAddress, signer);
    const owner = await hub.ownerOf(claimingId);
    errorCheck(owner != address, `${claimingId} is not owned by ${owner}`);
    const claimant = await contract.domainsClaimedWithBy(claimingId);
    // can be claimed
    errorCheck(
      claimant != ethers.constants.AddressZero,
      `${claimingId} has already been claimed`
    );
  }

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
    console.log(`Seller wallet is not a contract`);
  }

  const tx = await contract.connect(signer).claimDomains(claimingIds, {
    value: price.mul(count),
    type: 1,
    accessList: accessList,
  });
  return tx;
};
