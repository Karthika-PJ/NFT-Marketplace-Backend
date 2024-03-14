const IPFSUtils = require("../../utilities/IPFSUtils");
const { downloadFile } = require("../../utilities/downloadFile");
const { hexToInt } = require("../../utilities/hexToInt");
const assets = require("../../mongoModels/nftAssets");
const responseUtil = require("../../utilities/response");
const config = require("../../config");

const fetchMetadata = async (req, res) => {
  try {
    let tokenId = hexToInt(req.params.id);

    if (!tokenId) {
      return responseUtil.badRequestErrorResponse(res, "Invalid tokenId");
    }
    let fetchTokenData = await assets
      .findOne({ tokenId: tokenId })
      .select({ name: 1, attributes: 1, description: 1, image: 1, _id: 0 });

    return res.status(config.HTTP_STATUS_CODES.OK).send(fetchTokenData);
  } catch (e) {
    console.error(e);
    responseUtil.serverErrorResponse(res, e);
  }
};

module.exports = {
  fetchMetadata,
};
