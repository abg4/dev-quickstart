// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const {getContract, deployments, web3, hre } = require("hardhat");
const { toBN, toWei, fromWei, utf8ToHex, hexToUtf8, padRight } = web3.utils;

const { interfaceName } = require("@uma/common");

const OptimisticDepositBox = getContract("OptimisticDepositBox");
const IdentifierWhitelist = getContract("IdentifierWhitelist");
const AddressWhitelist = getContract("AddressWhitelist");
const WETH9 = getContract("WETH9");
const Finder = getContract("Finder");
const Timer = getContract("Timer");
const OptimisticOracle = getContract("OptimisticOracle");

const priceFeedIdentifier = utf8ToHex("ETHUSD");

async function main() {
  const [account] = await web3.eth.getAccounts();
  
  let collateral = await WETH9.new().send({ from: account });
  await deployments.save("WETH9", { abi: WETH9.abi, address: collateral.options.address });

  // Pricefeed identifier must be whitelisted so the DVM can be used to settle disputes.
  const identifierWhitelist = await IdentifierWhitelist.deployed();
  await identifierWhitelist.methods.addSupportedIdentifier(priceFeedIdentifier).send({ from: account });
  console.log(`- Pricefeed identifier for ${hexToUtf8(priceFeedIdentifier)} is whitelisted`);

  // Collateral must be whitelisted for payment of final fees.
  const addressWhitelist = await AddressWhitelist.deployed();
  await addressWhitelist.methods.addToWhitelist(collateral.options.address).send({ from: account });
  console.log("- Collateral address for wETH is whitelisted");

  const finder = await Finder.deployed();
  const timer = await Timer.deployed();
  const optimisticOracle = await OptimisticOracle.deployed();

  const optimisticOracleInterfaceName = utf8ToHex(interfaceName.OptimisticOracle);
  await finder.methods
    .changeImplementationAddress(optimisticOracleInterfaceName, optimisticOracle.options.address)
    .send({ from: account });
  console.log("- Deployed an OptimisticOracle");

  console.log(collateral.options.address,
    finder.options.address,
    priceFeedIdentifier,
    timer.options.address)

  const optimisticDepositBox = await OptimisticDepositBox.new(
    collateral.options.address,
    finder.options.address,
    priceFeedIdentifier,
    timer.options.address
  ).send({ from: account, gas: 4712388, gasPrice: 100000000000 });
  console.log("- Deployed a new OptimisticDepositBox at: " + optimisticDepositBox.options.address );

  return optimisticDepositBox.options.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
