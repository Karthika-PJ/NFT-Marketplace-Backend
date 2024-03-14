const { Transaction } = require("ethereumjs-tx");
const Common = require("ethereumjs-common").default;
const keythereum = require("keythereum");
const { getWallet } = require("../modules/wallet-management/walletService");
// const {web3} = require("./web3");
const { getNonce, init } = require("../utilities/nonceManager");
const { getGasPrice } = require("../utilities/transactionFee");

// const network = process.env.NETWORK;
const adminAddress = process.env.ADMIN_ADDRESS;

const getTransactionOptions = (network) => {
  switch (network) {
    case "mainnet":
    case "ropsten":
    case "rinkeby":
    case "kovan":
    case "goerli":
    case "calaveras":
      return { chain: network };

    case "polygon-mainnet":
      return {
        common: Common.forCustomChain(
          "mainnet",
          {
            name: network,
            chainId: 137,
            networkId: 137,
          },
          "byzantium"
        ),
      };

    case "polygon-mumbai":
      return {
        common: Common.forCustomChain(
          "goerli",
          {
            name: network,
            chainId: 80001,
            networkId: 80001,
          },
          "byzantium"
        ),
      };

    case "xDai":
      return {
        common: Common.forCustomChain(
          "mainnet",
          {
            name: network,
            chainId: 100,
            networkId: 100,
          },
          "byzantium"
        ),
      };
    case "binance-mainnet":
      return {
        common: Common.forCustomChain(
          "mainnet",
          {
            name: network,
            chainId: 56,
            networkId: 56,
          },
          "byzantium"
        ),
      };
    case "binance-testnet":
      return {
        common: Common.forCustomChain(
          "rinkeby",
          {
            name: network,
            chainId: 97,
            networkId: 97,
          },
          "byzantium"
        ),
      };
      case "velas-testnet":
      return {
        common: Common.forCustomChain(
          "rinkeby",
          {
            name: network,
            chainId: 111,
            networkId: 111,
          },
          "istanbul"
        ),
      };
      case "velas-mainnet":
      return {
        common: Common.forCustomChain(
          "mainnet",
          {
            name: network,
            chainId: 106,
            networkId: 106,
          },
          "byzantium"
        ),
      };
    default:
      throw Error("Unsupported chain");
  }
};

const createTx = async (txObject, web3, network) => {
  try {
    txObject.from = adminAddress;

    const finalGasPrice = await getGasPrice(web3);
    txObject.gasPrice = web3.utils.toHex(finalGasPrice);
    const nonceCount = await getNonce(adminAddress, web3, network);
    txObject.nonce = web3.utils.toHex(nonceCount);

    // Estimate gas value by executing the transaction in vm
    const estimatedGas = await web3.eth.estimateGas(txObject);
    txObject.gasLimit = estimatedGas;
  

    const fromWallet = await getWallet({ publicAddress: adminAddress });
   
    const privateKeyG = keythereum.recover(
      fromWallet.password,
      fromWallet.keyObject
    );
    const privateKey = new Buffer.from(privateKeyG, "hex");

    const txOptions = getTransactionOptions(network);

    const tx = new Transaction(txObject, txOptions);
   
    tx.sign(privateKey);
    const serializedTx = tx.serialize();

    return "0x" + serializedTx.toString("hex");
  } catch (error) {
    await init(adminAddress, web3, network);
    throw Error(error);
  }
};

module.exports = createTx;
