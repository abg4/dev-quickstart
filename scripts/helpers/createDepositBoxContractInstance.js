const {OptimisticDepositBoxEthers__factory, OptimisticDepositBox__factory} = require("@uma/contracts-node")
const {getAddress} = require("@uma/contracts-node")

module.exports = async function createDepositBoxContractInstance(signer, networkId) {
  const address = await getAddress("OptimisticDepositBox",Number(networkId));
  return OptimisticDepositBoxEthers__factory.connect(address,signer);

}
