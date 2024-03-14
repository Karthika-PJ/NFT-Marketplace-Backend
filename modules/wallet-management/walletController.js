"use strict";

const messageUtil = require("../../utilities/message");
const responseUtil = require("../../utilities/response");
const sha3_256 = require("js-sha3").sha3_256;
const keythereum = require("keythereum");
const {web3_withdraw, web3} = require("../../service/web3");
const { validationResult } = require("express-validator");
const createTx = require("../../service/createTx");
const { init } = require("../../utilities/nonceManager");
const { addWallet } = require("./walletService");
const { getGasFee } = require("../../utilities/transactionFee");  

const adminAddress = process.env.ADMIN_ADDRESS;
const network = process.env.NETWORK_WITHDRAW; 

const createWallet = async (req, res, next) => {
  try {
    let password = sha3_256(String(Math.floor(Math.random() * 100000000 + 1)));

    let params = { keyBytes: 32, ivBytes: 16 };

    let dk = keythereum.create(params);

    var options = {
      kdf: "pbkdf2",
      cipher: "aes-128-ctr",
      kdfparams: {
        c: 262144,
        dklen: 32,
        prf: "hmac-sha256",
      },
    };

    let keyObject = keythereum.dump(
      password,
      dk.privateKey,
      dk.salt,
      dk.iv,
      options
    );

    let publicAddress = "0x" + keyObject.address;

    let values = {
      publicAddress: publicAddress,
      password: password,
      keyObject: keyObject,
      role: 2,
      status: 1,
    };

    await addWallet(values);

    responseUtil.successResponse(res, "Wallet created", {
      publicAddress: publicAddress,
    });
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

const coinTransfer = async (req, res, next) => {
  try {
    let errorArr = [];

    const errors = validationResult(req);
    errorArr = errors.array();

    if (errorArr.length) {
      return responseUtil.validationErrorResponse(res, errorArr);
    }
    const toAddress = req.body.toAddress;
    const amountInDecimal = req.body.amount;

    var txObject = {};
    txObject.to = toAddress;
    txObject.value = web3_withdraw.utils.toHex(
      web3_withdraw.utils.toWei(amountInDecimal.toString(), "ether")
    );
    txObject.gasLimit = web3_withdraw.utils.toHex(21000);

    const txSerialized = await createTx(txObject, web3_withdraw, network);

    web3_withdraw.eth
      .sendSignedTransaction(txSerialized)
      .on("transactionHash", async (txHash) => {
        // req.body.txHash = txHash;
        // await addTransaction(req.body)
        return responseUtil.successResponse(res, "Transfer completed", {
          txHash: txHash,
        });
      })
      .on("error", async (error) => {
        await init(adminAddress, web3_withdraw, network);
        console.log(error);
        return responseUtil.serverErrorResponse(res, "Transfer Failed");
      });
  } catch (error) {
    console.log(error);
    return responseUtil.serverErrorResponse(res, "Transfer Failed");
  }
};

const getGasCost = async (req, res) => {
  const standard = req.params.standard;
  const transactionType = req.params.transactionType;

  const type = transactionType ? `${standard}-${transactionType}` : standard;

  try {
    const gasCost = await getGasFee(type, web3);
    if (gasCost) {
      return responseUtil.successResponse(res, "success", {
        gasCost
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
  createWallet,
  coinTransfer,
  getGasCost
};
