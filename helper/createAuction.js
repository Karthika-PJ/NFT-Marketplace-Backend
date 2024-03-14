const auctionAbi = require("../config/auctionabi.json");

const contractAddress = process.env.AUCTION_CONTRACT_ADDRESS;
const adminAddress = process.env.ADMIN_ADDRESS;

const { web3 } = require("../service/web3");
const network = process.env.NETWORK;
const createTx = require("../service/createTx");
const config = require('../config');
const { init } = require("../utilities/nonceManager");
const { sendTxData, sendTxDataToAdmin } = require("./confirmationCallback");


const createAuctionObject = (data, txObject) => {
    const seller = data.seller;
    const startingPrice = data.startingPrice;
    const buyNowPrice = data.buyNowPrice;
    const tokenId = data.tokenId;
    const royaltyReceiver = data.royaltyReceiver;
    const royaltyPercentage = data.royaltyPercentage;
    const metaHash = data.metaHash;
    
    console.log("data:", data);

    const myContract = new web3.eth.Contract(auctionAbi, contractAddress);

    txObject.data = myContract.methods
        .mintAndStartAuction(startingPrice, buyNowPrice,
            [[royaltyReceiver, royaltyPercentage] ], seller, tokenId, metaHash
        )
        .encodeABI();
    // txObject.gasLimit = web3.utils.toHex(config.GAS.ERC721.ENDING_AUCTION.RESERVE);

};

const createAuction = async (data) => {
    var txObject = {};

    const orderId = data.orderId ? data.orderId : null;

    txObject.to = contractAddress;
    txObject.value = "0x";

    createAuctionObject(data, txObject);


    const txSerialized = await createTx(txObject, web3, network);

    web3.eth
        .sendSignedTransaction(txSerialized)
        .on("transactionHash", async (txHash) => {
            data.txHash = txHash;
            //   await addTransaction(req.body)
            console.log("Transfer completed", {
                txHash: txHash
            });
            await sendTxData(
                {
                    txhash: txHash,
                    tokenId: data.tokenId,
                    type: "auction_create",
                },
                "/v1/asset/order/orderTx"
            );

            await sendTxDataToAdmin(
                {
                    txhash: txHash,
                    tokenId: data.tokenId,
                    type: "auction_create",
                },
                "/v1/admin/asset/minting/callback"
            );
        })
        .on("error", async (error) => {
            await init(adminAddress, web3, network);
            console.log(error);
        });
};

module.exports = createAuction;
