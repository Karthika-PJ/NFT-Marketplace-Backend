const erc1155contractAbi = require("../config/erc1155abi.json");
const erc721contractAbi = require("../config/erc721abi.json");

const contractAddress = process.env.CONTRACT_ADDRESS;
const adminAddress = process.env.ADMIN_ADDRESS;
const CONTRACT_TYPE = process.env.CONTRACT_TYPE;
const network = process.env.NETWORK;

const {web3} = require("../service/web3");
const createTx = require("../service/createTx");
const config = require('../config');
const { init } = require("../utilities/nonceManager");
const { sendTxData, sendTxDataToAdmin } = require("./confirmationCallback");

const erc1155TransferObject = (data, txObject) => {
  const fromAddress = data.fromAddress;
  const toAddress = data.toAddress;
  const tokenId = data.tokenId;

  const myContract = new web3.eth.Contract(erc1155contractAbi, contractAddress);

  if (Array.isArray(tokenId)) {
    // Do batch transfer if incoming token id is an array
    const tokenCountList = new Array(tokenId.length).fill("1");
    txObject.data = myContract.methods
      .safeBatchTransferFrom(
        fromAddress,
        toAddress,
        tokenId,
        tokenCountList,
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      )
      .encodeABI();
    // txObject.gasLimit = web3.utils.toHex(config.GAS.ERC1155.TRANSFERING.RESERVE);
  } else {
    // call transfer function in contract if there is only one token
    txObject.data = myContract.methods
      .safeTransferFrom(
        fromAddress,
        toAddress,
        tokenId,
        "1",
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      )
      .encodeABI();
    // txObject.gasLimit = web3.utils.toHex(config.GAS.ERC1155.TRANSFERING.RESERVE);
  }
};

const erc721TransferObject = (data, txObject) => {
  const fromAddress = data.fromAddress;
  const toAddress = data.toAddress;
  const tokenId = data.tokenId;

  const myContract = new web3.eth.Contract(erc721contractAbi, contractAddress);

  txObject.data = myContract.methods
    .safeTransferFrom(
      fromAddress,
      toAddress,
      tokenId
    )
    .encodeABI();
  // txObject.gasLimit = web3.utils.toHex(config.GAS.ERC721.TRANSFERING.RESERVE);
};

const transferNFT = async (data) => {
  var txObject = {};

  const orderId = data.orderId ? data.orderId : null;

  txObject.to = contractAddress;
  txObject.value = "0x";

  switch (CONTRACT_TYPE) {
    case config.CONTRACT_TYPE.ERC1155: erc1155TransferObject(data, txObject);
      break;
    case config.CONTRACT_TYPE.ERC721: erc721TransferObject(data, txObject);
      break;
    default: return;
  }

  const txSerialized = await createTx(txObject, web3, network);

  web3.eth
    .sendSignedTransaction(txSerialized)
    .on("transactionHash", async (txHash) => {
      data.txHash = txHash;
      // await addTransaction(req.body)
      console.log("Transfer completed", {
        txHash: txHash
      });

      await sendTxData({
        txhash: txHash,
        tokenId: data.tokenId,
        orderId: orderId,
        type: "transfer"
      },
      "/v1/asset/order/orderTx"
      );
      await sendTxDataToAdmin(
        {
          txhash: txHash,
          tokenId: data.tokenId,
          orderId: orderId,
          type: "transfer"
        },
        "/v1/admin/asset/minting/callback"
      );
    })
    .on("error", async (error) => {
      await init(adminAddress, web3, network);
      console.log(error);
    });
};

module.exports = transferNFT;
