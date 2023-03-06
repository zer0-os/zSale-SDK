import * as ethers from "ethers";
import { getSaleStatus } from ".";
import { GenSale } from "../../contracts/types";
import { Claim, Mintlist, Maybe, GenSaleStatus } from "../../types";

const abi = ["function masterCopy() external view returns (address)"];

const errorCheck = (condition: boolean, errorMessage: string) => {
    if (condition) {
        throw new Error(errorMessage);
    }
};

export const purchaseDomains = async (
    count: ethers.BigNumber,
    signer: ethers.Signer,
    contract: GenSale,
    mintlist: Mintlist
): Promise<ethers.ContractTransaction> => {
    const status: GenSaleStatus = await getSaleStatus(contract);

    errorCheck(
        status === GenSaleStatus.NotStarted,
        "Cannot purchase a domain when sale has not started"
    );

    errorCheck(status === GenSaleStatus.Ended, "Sale has already ended");

    errorCheck(count.eq("0"), "Cannot purchase 0 domains");

    const paused = await contract.paused();
    errorCheck(paused, "Sale contract is paused");

    const address = await signer.getAddress();
    const balance = await signer.getBalance();
    const price = await contract.salePrice();

    errorCheck(
        balance.lt(price.mul(count)),
        `Not enough funds given for purchase of ${count} domains`
    );

    let tx: ethers.ContractTransaction;
    const purchased = await contract.domainsPurchasedByAccount(address);
    let userClaim: Maybe<Claim> = mintlist.claims[address];

    // To purchase in private sale a user must be on the mintlist
    errorCheck(!userClaim, "User is not part of claim sale");
    userClaim = userClaim!;

    if (status === GenSaleStatus.ClaimSale) {  //Claim Sale, not yet private sale

        // Cannot purchase over the allowed mintlist limit
        errorCheck(
            purchased.add(count).gt(userClaim.quantity),
            `This user has already claimed ${purchased.toString()} and claiming ${count.toString()} more domains would go over the maximum claim amount of domains for this user, ${userClaim.quantity}. Try reducing the claim amount.`
        );

        tx = await contract
            .connect(signer)
            .purchaseDomains(
                count,
                userClaim.index,
                userClaim.quantity,
                userClaim.proof
            );
    } else {
        // Private sale
        const transactionLimit = await contract.limitPerTransaction();
        errorCheck(
            count.gt(transactionLimit),
            `The given number of ${count.toString()} exceeds the purchase limit per transaction in the Private Sale: ${transactionLimit.toString()}.`
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
    }
    return tx;
};
