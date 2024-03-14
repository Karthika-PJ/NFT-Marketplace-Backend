const arweaveUtils = require("../../utilities/arweaveUtils");
const { downloadFile } = require("../../utilities/downloadFile");
const deleteFile = require("../../utilities/deleteFile");
const assets = require("../../mongoModels/nftAssets");
const responseUtil = require("../../utilities/response");
const config = require("../../config");
// const { ARWEAVE } = require("../../config");

const saveAsset = async (req, res) => {
  try {
    if (!req.body.name) {
      return responseUtil.badRequestErrorResponse(res, "Invalid name");
    }

    if (!req.body.tokenId) {
      return responseUtil.badRequestErrorResponse(res, "Invalid tokenId");
    }

    if (req.body.attributes && !(req.body.attributes instanceof Array)) {
      return responseUtil.badRequestErrorResponse(
        res,
        "Invalid attributes , Attributes must me an Array "
      );
    }

    let filepath = null;
    let ARWEAVE_IMAGE_URL = null;

    if (req.body.image) {
      filepath = await downloadFile(req.body.image);

      const arweave_file_txn = await arweaveUtils.saveFileToArweave({
        name: req.body.name,
        path: filepath.path
      });
      if (!arweave_file_txn) {
        return responseUtil.badRequestErrorResponse(
          res,
          "Unable to upload to Arweave"
        );
      }
      ARWEAVE_IMAGE_URL = config.ARWEAVE.URL + arweave_file_txn.id;
    }

    let arweave_JSON_txn = await arweaveUtils.saveJSONToArweave({
      name: req.body.name,
      description: req.body.description,
      attributes: req.body.attributes,
      image: ARWEAVE_IMAGE_URL
    });

    if (!arweave_JSON_txn) {
      return responseUtil.badRequestErrorResponse(
        res,
        "Unable to upload JSON to Arweave"
      );
    }

    let ARWEAVE_JSON_URL = config.ARWEAVE.URL + arweave_JSON_txn.id;

    let assetData = await new assets({
      name: req.body.name,
      description: req.body.description,
      attributes: req.body.attributes,
      STORAGE_IMG_URL: ARWEAVE_IMAGE_URL,
      tokenId: req.body.tokenId,
      image: ARWEAVE_IMAGE_URL,
      STORAGE_JSON_URL: ARWEAVE_JSON_URL,
      IPFS_IMG_URL : ARWEAVE_IMAGE_URL,
      IPFS_JSON_URL : ARWEAVE_JSON_URL,
    }).save();
    try{
        if(filepath?.path) deleteFile(filepath.path);
    } catch (e){
        console.error(e);
    }

    return responseUtil.successResponse(res, "data uploaded", assetData);
  } catch (e) {
    console.error(e);
    responseUtil.serverErrorResponse(res, e);
  }
};

module.exports = {
  saveAsset,
};
