// const web3 = require("../service/web3");

let NONCE = {};

const walletWalidator = (wallet, web3, network) => {
  if (!wallet) throw Error("wallet not received");
  if (!web3.utils.isAddress(wallet)) throw Error("invalid address");
};

const init = async (wallet, web3, network) => {
  walletWalidator(wallet, web3, network);
  if (NONCE[wallet]) {
    NONCE[wallet][network] = await web3.eth.getTransactionCount(wallet, "pending");
  } else {
    NONCE[wallet] = {};
    NONCE[wallet][network] = await web3.eth.getTransactionCount(wallet, "pending");
  }
  // NONCE[wallet, network] = await web3.eth.getTransactionCount(wallet, "pending");
};

const updateNonce = (wallet, web3, network) => {
  walletWalidator(wallet, web3, network);
  if (NONCE[wallet]) {
    NONCE[wallet][network]++;
  } else {
    NONCE[wallet] = {};
    NONCE[wallet][network]++;
  }
  // NONCE[wallet, network]++;
};

const getNonce = async (wallet, web3, network) => { 
  walletWalidator(wallet, web3, network);
  if (!NONCE[wallet]) await init(wallet, web3, network);

  if (NONCE[wallet]) {
    return NONCE[wallet][network]++;
  } else {
    NONCE[wallet] = {};
    return NONCE[wallet][network]++;
  }

  // return NONCE[wallet, network]++;
};

module.exports = {
  init,
  updateNonce,
  getNonce,
};
