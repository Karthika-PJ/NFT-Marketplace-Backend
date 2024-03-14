const auctionAbi = require("../config/auctionabi.json");

const contractAddress = process.env.AUCTION_CONTRACT_ADDRESS;
const adminAddress = process.env.ADMIN_ADDRESS;

const { web3 } = require("../service/web3"); 
const network = process.env.NETWORK;  
const createTx = require("../service/createTx");
const config = require('../config');
const { init } = require("../utilities/nonceManager");
const { sendTxData, sendTxDataToAdmin } = require("./confirmationCallback");

const updateMaintainerObject = (data, txObject) => {
    const maintainerAddress = data.maintainerAddress;
    const maintainerInitialFee = data.maintainerInitialFee;
    const maintainerSeconderyFee = data.maintainerSeconderyFee;
    console.log("data:", data);

    const myContract = new web3.eth.Contract(auctionAbi, contractAddress);
    // const metaHash = await getTokenMetaHash(tokenId);  //ipfs will be sending from frontend.

    txObject.data = myContract.methods
        .updateMaintainer(
            [maintainerAddress, maintainerSeconderyFee], maintainerInitialFee
        )
        .encodeABI();
    // txObject.gasLimit = web3.utils.toHex(config.GAS.ERC721.MINTING.RESERVE);
};

const updateMaintainer = async (data) => {
    var txObject = {};

    const orderId = data.orderId ? data.orderId : null;

    txObject.to = contractAddress;
    txObject.value = "0x";

    updateMaintainerObject(data, txObject);

    const txSerialized = await createTx(txObject, web3, network);

    web3.eth
        .sendSignedTransaction(txSerialized)
        .on("transactionHash", async (txHash) => {
            data.txHash = txHash;
            //   await addTransaction(req.body)
            console.log("Transfer completed", {
                txHash: txHash
            });

            // await sendTxData(
            //     {
            //         txhash: txHash,
            //         tokenId: data.tokenId,
            //         type: "update_maintainer",
            //     },
            //     "/v1/asset/order/orderTx"
            // );

            await sendTxDataToAdmin(
                {
                    txhash: txHash,
                    maintainerAddress: data.maintainerAddress,
                    maintainerInitialFee: data.maintainerInitialFee,
                    maintainerSeconderyFee: data.maintainerSeconderyFee,
                    type: "update_maintainer",
                },
                "/v1/admin/asset/minting/callback"
            );

        })
        .on("error", async (error) => {
            await init(adminAddress, web3, network);
            console.log(error);
        });
};

module.exports = updateMaintainer;
