const {OptimisticDepositBoxEthers__factory, OptimisticDepositBox__factory} = require("@uma/contracts-node")
const {getAddress} = require("@uma/contracts-node")

module.exports = async function createERC20ContractInstance(signer, networkId) {
  const address = await getAddress("VotingToken",Number(networkId));
  return VotingTokenEthers__factory.connect(address,signer);
};
