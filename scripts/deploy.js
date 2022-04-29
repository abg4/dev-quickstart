// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { getContract, deployments, web3 } = require("hardhat");

const OptimisticDepositBox = getContract("OptimisticDepositBox");

const IdentifierWhitelist = getContract("IdentifierWhitelist");
const AddressWhitelist = getContract("AddressWhitelist");
const Finder = getContract("Finder");
const Timer = getContract("Timer");
const OptimisticOracle = getContract("OptimisticOracle");
const WETH9 = getContract("WETH9");

async function main() {
  const [account] = await web3.eth.getAccounts();
  console.log("The contract deployer is " + account)

  let finder;
  let timer;
  let optimisticOracle;
  let addressWhitelist;
  let identifierWhitelist;
  let optimisticDepositBox;
  
  if (await deployments.getOrNull("Finder")) {
    finder = await Finder.deployed();
    console.log("An existing Finder contract address is " + finder.options.address)
  } else {
    finder = await Finder.new().send({ from: account });
    await deployments.save("Finder", { abi: Finder.abi, address: finder.options.address });
    console.log("A new Finder contract has been deployed to " + finder.options.address)
  }

  if (await deployments.getOrNull("Timer")) {
    timer = await Timer.deployed();
    console.log("An existing Timer contract address is " + timer.options.address)
  } else {
    timer = await Timer.new().send({ from: account });
    await deployments.save("Timer", { abi: Timer.abi, address: timer.options.address });
    console.log("A new Timer contract has been deployed to " + timer.options.address)
  }

  if (await deployments.getOrNull("OptimisticOracle")) {
    optimisticOracle = await OptimisticOracle.deployed();
    console.log("An existing Optimistic Oracle contract address is " + optimisticOracle.options.address)
  } else {
    let liveness = 60;
    let finder = await Finder.deployed();
    let timer = await Timer.deployed();
    optimisticOracle = await OptimisticOracle.new(liveness, finder.options.address, timer.options.address).send({ from: account });
    await deployments.save("OptimisticOracle", { abi: OptimisticOracle.abi, address: optimisticOracle.options.address });
    console.log("A new Optimistic Oracle contract has been deployed to " + optimisticOracle.options.address)
  }

  if (await deployments.getOrNull("AddressWhitelist")) {
    addressWhitelist = await AddressWhitelist.deployed();
    console.log("An existing Address Whitelist contract address is at " + addressWhitelist.options.address)
  } else {
    addressWhitelist = await AddressWhitelist.new().send({ from: account });
    await deployments.save("AddressWhitelist", { abi: AddressWhitelist.abi, address: addressWhitelist.options.address });
    console.log("A new Address Whitelist contract has been deployed to " + addressWhitelist.options.address)
  }

  if (await deployments.getOrNull("IdentifierWhitelist")) {
    identifierWhitelist = await IdentifierWhitelist.deployed();
    console.log("An existing Identifier Whitelist contract address is at " + identifierWhitelist.options.address)
  } else {
    identifierWhitelist = await IdentifierWhitelist.new().send({ from: account });
    await deployments.save("IdentifierWhitelist", { abi: IdentifierWhitelist.abi, address: identifierWhitelist.options.address });
    console.log("A new Identifier Whitelist contract has been deployed to " + identifierWhitelist.options.address)
  }

  if (await deployments.getOrNull("WETH9")) {
    weth9 = await WETH9.deployed();
    console.log("An existing WETH9 contract address is at " + weth9.options.address)
  } else {    
    weth9 = await WETH9.new().send({ from: account });
    await deployments.save("WETH9", { abi: WETH9.abi, address: weth9.options.address });
    console.log("A new WETH9 contract has been deployed to " + weth9.options.address)
  }

  if (await deployments.getOrNull("OptimisticDepositBox")) {
    optimisticDepositBox = await OptimisticDepositBox.deployed();
    console.log("An existing OptimisticDepositBox contract address is at " + optimisticDepositBox.options.address)
  } else {
    let priceFeedIdentifier = "0x554d415553440000000000000000000000000000000000000000000000000000"

    optimisticDepositBox = await OptimisticDepositBox.new(weth9.options.address, finder.options.address, priceFeedIdentifier, timer.options.address).send({ from: account });
    await deployments.save("OptimisticDepositBox", { abi: OptimisticDepositBox.abi, address: optimisticDepositBox.options.address });
    console.log("A new OptimisticDepositBox contract has been deployed to " + optimisticDepositBox.options.address)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
