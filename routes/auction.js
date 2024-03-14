"use strict";

const express = require("express");
const router = express.Router();
const { verifyAPIKey } = require("../middleware/verifyAPIKey");
const {
  pushAuctionEnding, pushAuctionStart, pushMintAndTransfer, pushUpdateMaintainer
} = require("../modules/contract-management/contractController");

router.post("/pushAuctionEnding", verifyAPIKey, pushAuctionEnding);
router.post("/pushAuctionStart", verifyAPIKey, pushAuctionStart);
router.post("/pushMintAndTransfer", verifyAPIKey, pushMintAndTransfer);
router.post("/pushUpdateMaintainer", verifyAPIKey, pushUpdateMaintainer);

module.exports = router;

