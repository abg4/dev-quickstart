const {OptimisticOracleEthers__factory} = require("@uma/contracts-node")
const ethers = require("ethers");

function createOOContractInstance(signer, address) {
  const contract = OptimisticOracleEthers__factory.connect(address, signer);

  return contract;
}

module.exports = createOOContractInstance;
