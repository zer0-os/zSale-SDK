# zSale-SDK

## What is the zSale SDK?

The zSale SDK acts as an interface with the zNS sale contract. This allows you to create sales of subdomains that enable a whitelisted time period. This period means that only approved users put on a list by the seller can purchase domains. 

## How do you use it?

To use the SDK you must first create an `Instance` to work with. The `createInstance` function exported by the SDK takes a `Config` as an argument, which has three properties.

 - `isEth: boolean` - Indicates whether purchases for the sale of domains will be made with Ethereum or not. The alternative is an ERC20 token, e.g. `$WILD`. If this is set to `false`, it is expected that the contract provided in `contractAddress: string` below contains a valid value for `saleToken`, an address of an ERC20 contract.
 - contractAddress - The `WhitelistSimpleSale` contract implementation for this specific sale.
 - `merkleTreeFileUri: string` - The IPFS URL (`ipfs://Qm...`) where the merkle tree can be found. This file is used to derive information about a sale's whitelist.

If your sale is using an ERC20 token than customers in the sale will additionally have to call `approve(spender, amount)` to give the smart contract permission to use their tokens. For this, the `amount` argument is optional and if it is not specified the SDK defaults to the maximum safe value in TypeScript.

You can see how much the contract is allowed to use from a given user by checking the `allowance(owner, spender)` function.

You are also able to see the balance of a wallet at any time by calling `getEthBalance(signer)`, if the sale is using Ethereum, or `balanceOf(saleTokenAddress, userAddress, provider)` if the sale is using an ERC20 token.

## Making a Purchase

 Purchasing a domain has several user friendly checks it does before calling the contract function directly. This is a gas efficiency so that functions we know will fail don't reach the smart contract and waste the users funds.
  - **Balance**: First a user's balance is checked to confirm that they have the funds to make the purchase.
  - **Purchase Limit**: A user is only allowed to purchase a maximum number of domains per account and if this purchase goes above that set value it will not go through.
  - **Sale Status**: The status of a sale is also checked upon each purchase so that we can confirm if a sale has started, is in a whitelist only phase, or is in a public purchase phase. If the sale has not started, the purchase will fail. If the sale is in whitelist onky and the user is not on the whitelist, the purchase will also fail.

## Other Functionality

The owner of the sale has the ability to call `setPauseStatus` to pause or unpause the contract. This can done if halting the sale is needed at any point.

## SDK Functions

Below is a list of all functions exposed through the zSale SDK.

### Sale Information

  `getSalePrice(signer: ethers.Signer): Promise<string>;`

  `getSaleData(signer: ethers.Signer): Promise<SaleData>;`

  `getSaleStartBlock(signer: ethers.Signer): Promise<string>;`
  
  `getSaleStatus(signer: ethers.Signer): Promise<SaleStatus>;`
  
  `getSaleMintlistDuration(signer: ethers.Signer): Promise<ethers.BigNumber>;`

  `getTotalForSale(signer: ethers.Signer): Promise<ethers.BigNumber>;`

### Aggregate Data

  `getNumberOfDomainsSold(signer: ethers.Signer): Promise<ethers.BigNumber>;`

  `getDomainsPurchasedByAccount(signer: ethers.Signer): Promise<number>;`

  `getMintlist(merkleFileUri: string, gateway: IPFSGatewayUri): Promise<Whitelist>;`
 
  `getMintlistedUserClaim(address: string, gateway: IPFSGatewayUri: Promise<Claim>;`
  
### Helpers
  
  `getBlockNumber(): Promise<number>;`
  
  `getEthBalance(signer: ethers.Signer): Promise<string>;`
  
  `isUserOnMintlist(address: string, gateway: IPFSGatewayUri): Promise<boolean>;`
  
 
### Utility
  
  `purchaseDomains(count: ethers.BigNumber, signer: ethers.Signer): Promise<ethers.ContractTransaction>;`
  
  `setPauseStatus(pauseStatus: boolean, signer: ethers.Signer): Promise<ethers.ContractTransaction>;`
  
## Release
Release tagging and publishing is now done through a CircleCi integration.

- By including "fix(<subject>)" as the title of your pull request or commit message it will trigger a patch/fix release

- By including "feat(<subject>)" as the title of your pull request or commit message it will trigger a feature/minor release

- By including "BREAKING CHANGE" as the title of your pull request or commit message it will trigger a major release
