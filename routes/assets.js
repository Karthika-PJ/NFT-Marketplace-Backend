"use strict";

const express = require("express");
const router = express.Router();
const { verifyAPIKey } = require("../middleware/verifyAPIKey");
const storage_option_url = require("../service/storage_provider");

// const { saveAsset, getAssetMetadata } = require('../modules/IPFSManagement');
const { saveAsset, getAssetMetadata } = require(storage_option_url);
const {
  pushAssetForMinting,
  pushAssetForTransfering,
  getTokenMeta
} = require("../modules/contract-management/contractController");

router.post("/", verifyAPIKey, saveAsset);
router.get("/:contract/:tokenId", verifyAPIKey, getTokenMeta);
router.post("/pushAssetForMinting", verifyAPIKey, pushAssetForMinting);
router.post("/pushAssetForTransfering", verifyAPIKey, pushAssetForTransfering);
router.get("/metadata/:id.json", getAssetMetadata);

module.exports = router;
