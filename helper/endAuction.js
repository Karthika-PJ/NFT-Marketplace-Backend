const auctionAbi = require("../config/auctionabi.json");
const config = require("../config")

const contractAddress = config.AUCTION_CONTRACT_ADDRESS;
const adminAddress = config.ADMIN_ADDRESS;

const {web3} = require("../service/web3");
const network = config.NETWORK;
const createTx = require("../service/createTx");

const { init } = require("../utilities/nonceManager");
const {sendTxData, sendTxDataToAdmin} = require("./confirmationCallback");

const endAuctionObject = (data, txObject) => {
  const tokenId = data.tokenId;
  const myContract = new web3.eth.Contract(auctionAbi, contractAddress);

  txObject.data = myContract.methods
    .placeBid(
      tokenId
    )
    .encodeABI();
  // txObject.gasLimit = web3.utils.toHex(config.GAS.ERC721.ENDING_AUCTION.RESERVE);
};

const endAuction = async (data) => {
  var txObject = {};

  const orderId = data.orderId ? data.orderId : null;

  txObject.to = contractAddress;
  txObject.value = "0x";

  endAuctionObject(data, txObject);

  const txSerialized = await createTx(txObject, web3, network);

  web3.eth
    .sendSignedTransaction(txSerialized)
    .on("transactionHash", async (txHash) => {
      data.txHash = txHash;
      //   await addTransaction(req.body)
      console.log("Transfer completed", {
        txHash: txHash
      });

      await sendTxDataToAdmin(
        {
          txhash: txHash,
          tokenId: data.tokenId,
          type: "auction_end",
        },
        "/v1/admin/asset/minting/callback"
      );

      await sendTxData(
        {
          txhash: txHash,
          tokenId: data.tokenId,
          type: "auction_end",
        },
        "/v1/asset/order/orderTx"
      );

    })
    .on("error", async (error) => {
      await init(adminAddress, web3, network);
      console.log(error);
    });
};

module.exports = endAuction;
