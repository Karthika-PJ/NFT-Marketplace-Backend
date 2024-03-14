"use strict";

const adminAddress = process.env.ADMIN_ADDRESS;
const messageUtil = require("../../utilities/message");
const responseUtil = require("../../utilities/response");
const { validationResult } = require("express-validator");
const publishToQueue = require("../../utilities/queueUtils").publishToQueue;
const { addTransaction } = require("./contractService");
const config = require("../../config");
const { mintNFT, getTokenMetaHash } = require("../../helper/mintNFT");
const transferNFT = require("../../helper/transferNFT");
const endAuction = require("../../helper/endAuction");
const startAuction = require("../../helper/createAuction");
const updateMaintainer = require("../../helper/updateMaintainerDetails");
const { web3 } = require("../../service/web3");
const getERC721Meta = require("../../service/fetchMetadata");
const {
  NonExistingTokenException,
  UnsupportedContractException,
  InvalidTokenIdException,
} = require("../../utilities/customError");
const mintAndTransfer = require("../../helper/mintAndTransfer");

const getTokenMeta = async (req, res) => {
  try {

    if (!req.params.contract || !web3.utils.isAddress(req.params.contract)) {
      return responseUtil.badRequestErrorResponse(
        res,
        "Invalid contract address"
      );
    }

    if (!req.params.tokenId) {
      return responseUtil.badRequestErrorResponse(res, "Invalid token ID");
    }

    const meta = await getERC721Meta(req.params);

    responseUtil.successResponse(res, "metadata retrived", {
      metadata: meta,
    });

  } catch (e) {
    if (e instanceof NonExistingTokenException) {
      return responseUtil.notFoundErrorResponse(
        res,
        "query for non existing token"
      );
    } else if (e instanceof InvalidTokenIdException) {
      return responseUtil.badRequestErrorResponse(res, "Invalid token ID");
    } else if (e instanceof UnsupportedContractException) {
      return responseUtil.notFoundErrorResponse(
        res,
        "unsupported contract or cannot communicate to blockchain"
      );
    }
    return responseUtil.serverErrorResponse(res, e);
  }
};

const pushAssetForMinting = async (req, res) => {
  try {

    const admin_balance = await web3.eth.getBalance(adminAddress);
    if (admin_balance < config.ADMIN_WALLET_MIN_BALANCE) {
      return responseUtil.badRequestErrorResponse(res, "Insufficient funds for gas");
    }

    if (!req.body.tokenId) {
      return responseUtil.badRequestErrorResponse(res, "Invalid tokenId");
    }

    if (!req.body.metaHash) {
      return responseUtil.badRequestErrorResponse(res, "Invalid Token metaHash");
    }

    if (!req.body.toAddress || !web3.utils.isAddress(req.body.toAddress)) {
      return responseUtil.badRequestErrorResponse(res, "Invalid toAddress");
    }

    if (
      !req.body.royaltyReceiver ||
      !web3.utils.isAddress(req.body.royaltyReceiver)
    ) {
      return responseUtil.badRequestErrorResponse(
        res,
        "Invalid royalty reciever address"
      );
    }

    const royaltyPercentage = parseInt(req.body.royaltyPercentage);

    if (
      royaltyPercentage > 2000 ||
      royaltyPercentage < 0
    ) {
      return responseUtil.badRequestErrorResponse(
        res,
        "Invalid royalty percentage value"
      );
    }

    await publishToQueue(config.QUEUE.minting, req.body);

    return responseUtil.successResponse(res, "success");
  } catch (e) {
    console.error(e);
    responseUtil.serverErrorResponse(res, e);
  }
};

const pushAssetForTransfering = async (req, res) => {
  try {
    const admin_balance = await web3.eth.getBalance(adminAddress);
    if (admin_balance < config.ADMIN_WALLET_MIN_BALANCE) {
      return responseUtil.badRequestErrorResponse(res, "Insufficient funds for gas");
    }

    if (!req.body.tokenId) {
      return responseUtil.badRequestErrorResponse(res, "Invalid tokenId");
    }

    if (!req.body.fromAddress || !web3.utils.isAddress(req.body.fromAddress)) {
      return responseUtil.badRequestErrorResponse(res, "Invalid fromAddress");
    }

    if (!req.body.toAddress || !web3.utils.isAddress(req.body.toAddress)) {
      return responseUtil.badRequestErrorResponse(res, "Invalid toAddress");
    }

    await publishToQueue(config.QUEUE.transfering, req.body);

    return responseUtil.successResponse(res, "success");
  } catch (e) {
    console.error(e);
    responseUtil.serverErrorResponse(res, e);
  }
};

const pushAuctionEnding = async (req, res) => {
  
  try {
    const admin_balance = await web3.eth.getBalance(adminAddress);
    if (admin_balance < config.ADMIN_WALLET_MIN_BALANCE) {
      return responseUtil.badRequestErrorResponse(res, "Insufficient funds for gas");
    }
    if (!req.body.tokenId) {
      return responseUtil.badRequestErrorResponse(res, "Invalid tokenId");
    }

    await publishToQueue(config.QUEUE.endingAuction, req.body);

    return responseUtil.successResponse(res, "success");
  } catch (e) {
    console.error(e);
    responseUtil.serverErrorResponse(res, e);
  }
};

const pushAuctionStart = async (req, res) => {
  try {
    const admin_balance = await web3.eth.getBalance(adminAddress);

    if (admin_balance < config.ADMIN_WALLET_MIN_BALANCE) {
      return responseUtil.badRequestErrorResponse(res, "Insufficient funds for gas");
    }
    if (!req.body.tokenId) {
      return responseUtil.badRequestErrorResponse(res, "Invalid tokenId");
    }
    if (!req.body.seller) {
      return responseUtil.badRequestErrorResponse(res, "Invalid Seller");
    }
    if (!req.body.startingPrice) {
      return responseUtil.badRequestErrorResponse(res, "Invalid Starting Price");
    }
    if (!req.body.buyNowPrice) {
      return responseUtil.badRequestErrorResponse(res, "Invalid Buy Now Price");
    }
    if (!req.body.metaHash) {
      return responseUtil.badRequestErrorResponse(res, "Invalid Token metadata");
    }

    if (
      !req.body.royaltyReceiver ||
      !web3.utils.isAddress(req.body.royaltyReceiver)
    ) {
      return responseUtil.badRequestErrorResponse(
        res,
        "Invalid royalty reciever address"
      );
    }

    const royaltyPercentage = parseInt(req.body.royaltyPercentage);

    if (
      royaltyPercentage > 2000 ||
      royaltyPercentage < 0
    ) {
      return responseUtil.badRequestErrorResponse(
        res,
        "Invalid royalty percentage value"
      );
    }

    await publishToQueue(config.QUEUE.startAuction, req.body);

    return responseUtil.successResponse(res, "success");
  } catch (e) {
    console.error(e);
    responseUtil.serverErrorResponse(res, e);
  }
};

const pushMintAndTransfer = async (req, res) => {
  try {
    const admin_balance = await web3.eth.getBalance(adminAddress);
    if (admin_balance < config.ADMIN_WALLET_MIN_BALANCE) {
      return responseUtil.badRequestErrorResponse(res, "Insufficient funds for gas");
    }

    if (!req.body.tokenId) {
      return responseUtil.badRequestErrorResponse(res, "Invalid tokenId");
    }

    if (!req.body.metaHash) {
      return responseUtil.badRequestErrorResponse(res, "Invalid Token metaHash");
    }

    if (!req.body.toAddress || !web3.utils.isAddress(req.body.toAddress)) {
      return responseUtil.badRequestErrorResponse(res, "Invalid toAddress");
    }

    if (
      !req.body.royaltyReceiver ||
      !web3.utils.isAddress(req.body.royaltyReceiver)
    ) {
      return responseUtil.badRequestErrorResponse(
        res,
        "Invalid royalty reciever address"
      );
    }

    const royaltyPercentage = parseInt(req.body.royaltyPercentage);

    if (
      royaltyPercentage > 2000 ||
      royaltyPercentage < 0
    ) {
      return responseUtil.badRequestErrorResponse(
        res,
        "Invalid royalty percentage value"
      );
    }

    await publishToQueue(config.QUEUE.mintAndTransfer, req.body);

    return responseUtil.successResponse(res, "success");
  } catch (e) {
    console.error(e);
    responseUtil.serverErrorResponse(res, e);
  }
};

const pushUpdateMaintainer = async (req, res) => {
  try {
    if (!req.body.maintainerInitialFee) {
      return responseUtil.badRequestErrorResponse(res, "Invalid primary commission.");
    }

    if (!req.body.maintainerSeconderyFee) {
      return responseUtil.badRequestErrorResponse(res, "Invalid secondery commission.");
    }

    if (
      !req.body.maintainerAddress ||
      !web3.utils.isAddress(req.body.maintainerAddress)
    ) {
      return responseUtil.badRequestErrorResponse(
        res,
        "Invalid platform commission reciever address."
      );
    }

    await publishToQueue(config.QUEUE.updateMaintainer, req.body);

    return responseUtil.successResponse(res, "success");
  } catch (e) {
    console.error(e);
    responseUtil.serverErrorResponse(res, e);
  }
};

const consumeMintQueue = async (data) => {
  console.log(data);
  await mintNFT(data);
};

const consumeTransferQueue = async (data) => {
  console.log(data);
  await transferNFT(data);
};

const consumeAuctionEndQueue = async (data) => {
  console.log(data);
  await endAuction(data);
};

const consumeAuctionStartQueue = async (data) => {
  console.log(data);
  await startAuction(data);
};

const consumeMintAndTransferQueue = async (data) => {
  console.log(data);
  await mintAndTransfer(data);
};

const consumeUpdateMaintainerQueue = async (data) => {
  console.log(data);
  await updateMaintainer(data);
};

module.exports = {
  pushAssetForMinting,
  pushAssetForTransfering,
  pushAuctionEnding,
  pushAuctionStart,
  pushMintAndTransfer,
  pushUpdateMaintainer,
  consumeMintQueue,
  consumeTransferQueue,
  consumeAuctionEndQueue,
  consumeAuctionStartQueue,
  consumeMintAndTransferQueue,
  consumeUpdateMaintainerQueue,
  getTokenMeta,
};
