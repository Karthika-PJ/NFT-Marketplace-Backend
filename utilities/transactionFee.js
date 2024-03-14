// const web3 = require("../service/web3");
const { GAS } = require("../config");

const getGasPrice = async (web3) => {
  const gasPrice = await web3.eth.getGasPrice();
  return web3.utils.toBN(gasPrice).add(web3.utils.toBN("20000000000"));
};

const getGasFee = async (type, web3) => {
  let gas = null;

  switch (type) {
    case "erc1155-mint":
      gas = GAS.ERC1155.MINTING.CONSUME;
      break;
    case "erc1155-transfer":
      gas = GAS.ERC1155.TRANSFERING.CONSUME;
      break;
    case "erc721-mint":
      gas = GAS.ERC721.MINTING.CONSUME;
      break;
    case "erc721-transfer":
      gas = GAS.ERC721.TRANSFERING.CONSUME;
      break;
    case "eth-transfer":
      gas = GAS.ETH_TRANSFER;
      break;
  }

  if (gas) {
    const gasPrice = await getGasPrice(web3);
    const gasCostInWei = web3.utils.toBN(gas).mul(gasPrice);
    return web3.utils.fromWei(gasCostInWei, 'ether');
  };

  return null;
};

module.exports = {
  getGasPrice,
  getGasFee
};
