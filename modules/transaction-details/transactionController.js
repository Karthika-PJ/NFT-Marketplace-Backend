"use strict";

const web3 = require("../../service/web3");
const responseUtil = require("../../utilities/response");

const getTransactionFee = async (req, res) => {

    const transactionId = req.params.transactionId;
    console.log("transaction id: "+ transactionId);
    try {
        const txn_reciept = await web3.eth.getTransactionReceipt(transactionId);
        const gas_price = web3.utils.toBN(txn_reciept.effectiveGasPrice);
        const gas_used = web3.utils.toBN(txn_reciept.gasUsed);

        // console.log("transaction gas price: "+ gas_price);
        // console.log("transaction gas used: "+ gas_used);

        const transaction_cost_wei = gas_price.mul(gas_used);
        const transaction_cost = web3.utils.fromWei(transaction_cost_wei, 'ether');
        
        // console.log("transaction cost: "+ transaction_cost);

        if (transaction_cost) {
            return responseUtil.successResponse(res, "success", {
                transaction_cost
            });
        } else {
            return responseUtil.badRequestErrorResponse(res, "Invalid Params");
        }
    } catch (err) {
        console.log(err);
        return responseUtil.serverErrorResponse(res, "failed");
    }
};

module.exports = {
    getTransactionFee
};
