
import * as chai from 'chai';
import { BigNumber, ethers, Signer } from 'ethers';
import nock from "nock";
import { GenSaleConfig, GenSaleStatus, Mintlist } from '../src';
import { getMintlist, getSaleData, getSaleStatus, numberPurchasableByAccount, purchaseDomains, setPauseStatus } from '../src/actions/genSale';
import { GenSale } from '../src/contracts';
import { genSaleConfig, mocks } from './mocks/genMocks';
import * as chaiAsPromised from "chai-as-promised";
import { expect } from 'chai';
chai.use(chaiAsPromised.default);

const salePriceValue = BigNumber.from(ethers.utils.parseEther("0.07"));
describe("Sale SDK tests", async () => {

    beforeEach(async () => {
        mocks.reset();
    });

    describe("numberPurchasableByAccount", async () => {
        it("Returns 0 for users not in the mint list during private sale", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = salePriceValue;
            const mintlist: Mintlist = {
                merkleRoot: "0xabcd",
                claims: {
                    "0x123456789abcdef": { quantity: 3, index: 0, proof: ["0x1234"] },
                },
            };
            const account = "0xb";
            const result = await numberPurchasableByAccount(
                mintlist,
                mocks.genSale as GenSale,
                account
            );
            expect(result).to.equal(0);
        });

        it("Returns 0 for users not in the mint list during claim sale", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = BigNumber.from(0);
            const mintlist: Mintlist = {
                merkleRoot: "0xabcd",
                claims: {
                    "0x123456789abcdef": { quantity: 3, index: 0, proof: ["0x1234"] },
                },
            };
            const account = "0xb";
            const result = await numberPurchasableByAccount(
                mintlist,
                mocks.genSale as GenSale,
                account
            );
            expect(result).to.equal(0);
        });

        it("Returns user claim quantity during claim sale", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = BigNumber.from(0);
            const mintlist: Mintlist = {
                merkleRoot: "0xabcd",
                claims: {
                    "0x123456789abcdef": { quantity: 3, index: 0, proof: ["0x1234"] },
                },
            };
            const account = "0x123456789abcdef";
            const result = await numberPurchasableByAccount(
                mintlist,
                mocks.genSale as GenSale,
                account
            );
            expect(result).to.equal(mintlist.claims["0x123456789abcdef"]?.quantity);
        });

        it("Returns transaction limit during a private sale if on mintlist", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = salePriceValue;
            const mintlist: Mintlist = {
                merkleRoot: "0xabcd",
                claims: {
                    "0x123456789abcdef": { quantity: 3, index: 0, proof: ["0x1234"] },
                },
            };
            const account = "0x123456789abcdef";
            const result = await numberPurchasableByAccount(
                mintlist,
                mocks.genSale as GenSale,
                account
            );
            expect(result).to.equal(
                mocks.currentSaleConfiguration.transactionLimit.toNumber()
            );
        });

        it("Returns claim quantity for users on mintlist if sale has not started", async () => {
            mocks.currentSaleStarted = false;
            mocks.currentSalePrice = BigNumber.from(0);
            const mintlist: Mintlist = {
                merkleRoot: "0xabcd",
                claims: {
                    "0x123456789abcdef": { quantity: 3, index: 0, proof: ["0x1234"] },
                },
            };
            const account = "0x123456789abcdef";
            const result = await numberPurchasableByAccount(
                mintlist,
                mocks.genSale as GenSale,
                account
            );
            expect(result).to.equal(mintlist.claims["0x123456789abcdef"]?.quantity);
        });
    });

    describe("getMintlist", async () => {
        const mockMintlist: Mintlist = {
            merkleRoot: "0x123",
            claims: {},
        };

        afterEach(() => {
            nock.cleanAll();
        });

        it("Should return the mintlist from the main uri", async () => {
            const config: GenSaleConfig = {
                contractAddress: "0xabc",
                merkleTreeFileUri: "https://example.com/mintlist",
                web3Provider: new ethers.providers.JsonRpcProvider(),
            };

            nock("https://example.com").get("/mintlist").reply(200, mockMintlist);

            const result = await getMintlist(config);
            expect(result).to.deep.equal(mockMintlist);
        });

        it("Should return the mintlist from IPFS", async () => {
            const config: GenSaleConfig = {
                contractAddress: "0xabc",
                merkleTreeFileUri: "https://example.com/mintlist",
                web3Provider: new ethers.providers.JsonRpcProvider(),
                advanced: {
                    merkleTreeFileIPFSHash: "QmHash",
                    ipfsGateway: "https://ipfs.io/ipfs/",
                },
            };

            nock("https://example.com").get("/mintlist").reply(404, mockMintlist);

            nock("https://ipfs.io").get("/ipfs/QmHash").reply(200, mockMintlist);

            const result = await getMintlist(config);
            expect(result).to.deep.equal(mockMintlist);
        });
    });

    describe("getSaleStatus", () => {
        const mockSaleAsGenSale: GenSale = mocks.genSale as GenSale; // Cast to GenSale to access types

        it("Should return not started status if sale has not started", async () => {
            mocks.currentSaleStarted = false;
            const saleStatus = await getSaleStatus(mockSaleAsGenSale);
            expect(saleStatus).to.equal(GenSaleStatus.NotStarted);
        });

        it("Should return claim status if sale has started and price is not set", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = BigNumber.from(0);

            const saleStatus = await getSaleStatus(mockSaleAsGenSale);

            expect(saleStatus).to.equal(GenSaleStatus.ClaimSale);
        });

        it("Should return the Private status if sale has started and price is set", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = salePriceValue;

            const saleStatus = await getSaleStatus(mockSaleAsGenSale);

            expect(saleStatus).to.equal(GenSaleStatus.PrivateSale);
        });

        it("Should return the not started status if the sale has a price set and sale has not started", async () => {
            mocks.currentSaleStarted = false;
            mocks.currentSalePrice = salePriceValue;

            const saleStatus = await getSaleStatus(mockSaleAsGenSale);

            expect(saleStatus).to.equal(GenSaleStatus.NotStarted);
        });

        it("Should return the ended status if the sale has started but all domains have been sold", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = salePriceValue;
            mocks.currentDomainsSold = BigNumber.from(50);
            const saleStatus = await getSaleStatus(mockSaleAsGenSale);

            expect(saleStatus).to.equal(GenSaleStatus.Ended);
        });
    });

    describe("getSaleData", async () => {
        it("Should return the sale data correctly", async () => {
            const amountSold = 5;
            const amountForSale = 50;
            const transactionLimit = 10;
            const saleConfigurationRaw = genSaleConfig;

            mocks.currentSaleConfiguration = saleConfigurationRaw;
            mocks.currentDomainsSold = BigNumber.from(amountSold);
            mocks.currentAmountForSale = BigNumber.from(amountForSale);
            mocks.currentTransactionLimit = BigNumber.from(transactionLimit);
            mocks.currentSaleStarted = false;
            mocks.currentPauseStatus = false;
            mocks.currentSalePrice = saleConfigurationRaw.salePrice;
            const saleData = await getSaleData(mocks.genSale as GenSale);

            expect(saleData.saleStatus).to.equal(GenSaleStatus.NotStarted);
            expect(saleData.amountForSale).to.equal(amountForSale);
            expect(saleData.salePrice).to.equal(ethers.utils.formatEther(saleConfigurationRaw.salePrice));
            expect(saleData.amountSold).to.equal(amountSold);
            expect(saleData.started).to.equal(false);
            expect(saleData.paused).to.equal(false);
            expect(saleData.limitPerTransaction).to.equal(transactionLimit);
        });
    });

    describe("purchaseDomains", async () => {
        const mockMintlist: Mintlist = {
            merkleRoot:
                "0x1234567890123456789012345678901234567890123456789012345678901234",
            claims: {
                "0x1234567890123456789012345678901234567890": {
                    index: 0,
                    quantity: 11,
                    proof: [
                        "0x2222222222222222222222222222222222222222222222222222222222222222",
                    ],
                },
            },
        };
        const signer = mocks.signer as Signer;
        const mintlist = mockMintlist;

        it("Should fail if the sale is not yet started", async () => {
            mocks.currentSaleStarted = false;
            mocks.currentSalePrice = BigNumber.from(0);

            await expect(
                purchaseDomains(
                    BigNumber.from(1),
                    signer,
                    mocks.genSale as unknown as GenSale,
                    mintlist
                )
            ).to.be.rejectedWith(
                "Cannot purchase a domain when sale has not started"
            );
        });

        it("Should fail if sale has ended", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = salePriceValue;
            mocks.currentDomainsSold = BigNumber.from(50);
            await expect(
                purchaseDomains(
                    BigNumber.from(1),
                    signer,
                    mocks.genSale as unknown as GenSale,
                    mintlist
                )
            ).to.be.rejectedWith("Sale has already ended");
        });

        it("Should fail if count is 0", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = BigNumber.from(0);
            await expect(
                purchaseDomains(
                    BigNumber.from(0),
                    signer,
                    mocks.genSale as unknown as GenSale,
                    mintlist
                )
            ).to.be.rejectedWith("Cannot purchase 0 domains");
        });

        it("Should fail if sale contract is paused", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentPauseStatus = true;

            await expect(
                purchaseDomains(
                    BigNumber.from(1),
                    signer,
                    mocks.genSale as unknown as GenSale,
                    mintlist
                )
            ).to.be.rejectedWith("Sale contract is paused");
        });

        it("Should fail if purchasing more domains than claimable in claim sale", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = BigNumber.from(0)

            await expect(
                purchaseDomains(
                    BigNumber.from(12),
                    signer,
                    mocks.genSale as unknown as GenSale,
                    mintlist
                )
            ).to.be.rejectedWith(
                `This user has already claimed ${0} and claiming ${12} more domains would go over the maximum claim amount of domains for this user, ${mintlist.claims['0x1234567890123456789012345678901234567890']?.quantity}. Try reducing the claim amount.`
            );
        });

        it("Should fail if purchasing more domains than transaction limit in private sale", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = salePriceValue;
            mocks.currentTransactionLimit = BigNumber.from(10);
            await expect(
                purchaseDomains(
                    BigNumber.from(11),
                    signer,
                    mocks.genSale as unknown as GenSale,
                    mintlist
                )
            ).to.be.rejectedWith(
                `The given number of ${11} exceeds the purchase limit per transaction in the Private Sale: ${mocks.currentTransactionLimit}.`
            );
        });

        it("Should fail if user does not have enough funds for purchase request", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = salePriceValue;
            mocks.currentSignerFunds = ethers.utils.parseEther(".01");
            await expect(
                purchaseDomains(
                    BigNumber.from(1),
                    signer,
                    mocks.genSale as unknown as GenSale,
                    mintlist
                )
            ).to.be.rejectedWith(
                `Not enough funds given for purchase of ${1} domains`
            );
        });

        it("Should succeed if user attempts a valid purchase in private sale", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = salePriceValue;
            mocks.currentSignerFunds = ethers.utils.parseEther("1");
            await expect(
                purchaseDomains(
                    BigNumber.from(1),
                    signer,
                    mocks.genSale as unknown as GenSale,
                    mintlist
                )
            ).to.eventually.equal("purchased");
        });

        it("Should succeed if user attempts a valid claim in claim sale", async () => {
            mocks.currentSaleStarted = true;
            mocks.currentSalePrice = BigNumber.from(0)
            mocks.currentSignerFunds = ethers.utils.parseEther("1");
            await expect(
                purchaseDomains(
                    BigNumber.from(1),
                    signer,
                    mocks.genSale as unknown as GenSale,
                    mintlist
                )
            ).to.eventually.equal("purchased");
        });
    });

    describe("setPauseStatus", async () => {
        const signer = mocks.signer as Signer;
        it("Should not update pause status if already paused", async () => {
            mocks.currentPauseStatus = true;
            await expect(
                setPauseStatus(true, mocks.genSale as GenSale, signer)
            ).to.be.rejectedWith("Execution would cause no state change");
        });

        it("Can Pause", async () => {
            mocks.currentPauseStatus = false;
            await expect(
                setPauseStatus(true, mocks.genSale as GenSale, signer)
            ).to.eventually.equal(
                "toggled"
            );
        });

        it("Can Unpause", async () => {
            mocks.currentPauseStatus = true;
            await expect(
                setPauseStatus(false, mocks.genSale as GenSale, signer)
            ).to.eventually.equal(
                "toggled"
            );
        });
    });
});