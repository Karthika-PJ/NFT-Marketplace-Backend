const IPFSUtils = require("../../utilities/IPFSUtils");
const { downloadFile } = require("../../utilities/downloadFile");
const deleteFile = require("../../utilities/deleteFile");
const assets = require("../../mongoModels/nftAssets");
const responseUtil = require("../../utilities/response");
const config = require("../../config");

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

    let IPFS_URL = "";
    let filepath = null;

    if (req.body.image) {
      filepath = await downloadFile(req.body.image);

      const IPFS_data = await IPFSUtils.saveFileToIPFS({
        name: req.body.name,
        path: filepath.path
      });
      if (!IPFS_data) {
        return responseUtil.badRequestErrorResponse(
          res,
          "Unable to upload to IPFS"
        );
      }
      IPFS_URL = config.PINATA.URL + IPFS_data.IpfsHash;
    }

    let IPFS_JSON_data = await IPFSUtils.saveJSONToIPFS({
      name: req.body.name,
      description: req.body.description,
      attributes: req.body.attributes,
      image: IPFS_URL
    });

    if (!IPFS_JSON_data) {
      return responseUtil.badRequestErrorResponse(
        res,
        "Unable to upload JSON to IPFS"
      );
    }

    let IPFS_JSON_URL = config.PINATA.URL + IPFS_JSON_data.IpfsHash;

    let assetData = {
      name: req.body.name,
      description: req.body.description,
      attributes: req.body.attributes,
      STORAGE_IMG_URL: IPFS_URL,
      image: IPFS_URL,
      STORAGE_JSON_URL: IPFS_JSON_URL,
      IPFS_IMG_URL : IPFS_URL,
      IPFS_JSON_URL : IPFS_JSON_URL,

    }

    // TODO: comment this line later
    // This is to remove if multiple records with the same token id exists
     await assets.deleteMany({ tokenId : req.body.tokenId })

     await assets.findOneAndUpdate(
      { tokenId : req.body.tokenId },
      { $set: assetData },
      { upsert: true}
  );

  let responseData = {
    ...assetData, 
    tokenId: req.body.tokenId
  }

    try{
        if(filepath?.path) deleteFile(filepath.path);
    } catch (e){
        console.error(e);
    }

    return responseUtil.successResponse(res, "data uploaded", responseData);
  } catch (e) {
    console.error(e);
    responseUtil.serverErrorResponse(res, e);
  }
};

module.exports = {
  saveAsset,
};
