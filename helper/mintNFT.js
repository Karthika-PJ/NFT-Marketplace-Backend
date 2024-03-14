const erc1155contractAbi = require("../config/erc1155abi.json");
const erc721contractAbi = require("../config/erc721abi.json");

const contractAddress = process.env.CONTRACT_ADDRESS;
const adminAddress = process.env.ADMIN_ADDRESS;
const CONTRACT_TYPE = process.env.CONTRACT_TYPE;
const storageProvider = process.env.STORAGE_PROVIDER;
const network = process.env.NETWORK;

const {web3} = require("../service/web3");
const createTx = require("../service/createTx");
const config = require("../config");
const assets = require("../mongoModels/nftAssets");
const { init } = require("../utilities/nonceManager");
const { sendTxData, sendTxDataToAdmin } = require("./confirmationCallback");


const getTokenUriPrefixLength = () => {
  switch (storageProvider) {
    case "IPFS":
      return config.PINATA.URL.length;
    case "ARWEAVE":
      return config.ARWEAVE.URL.length;
    default:
      return 0;
  }
};

const getTokenMetaHash = async (tokenId) => {
  const { STORAGE_JSON_URL } = await assets
    .findOne({ tokenId: tokenId })
    .select({ STORAGE_JSON_URL: 1 });

  if (!STORAGE_JSON_URL) throw Error("Token is not existing");

  const tokenUriPrefixLength = getTokenUriPrefixLength();
  const metaHash = STORAGE_JSON_URL.substring(
    tokenUriPrefixLength,
    STORAGE_JSON_URL.length
  );
  console.log("metaHash:", metaHash);
  return metaHash;
};

const erc1155MintObject = (data, txObject) => {
  const toAddress = data.toAddress;
  const tokenId = data.tokenId;

  const myContract = new web3.eth.Contract(erc1155contractAbi, contractAddress);

  // Calling transfer function of contract and encode it in AB format
  if (Array.isArray(tokenId)) {
    // Do batch mint if incoming token id is an array
    const tokenCountList = new Array(tokenId.length).fill("1");
    txObject.data = myContract.methods
      .mintBatch(
        toAddress,
        tokenId,
        tokenCountList,
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      )
      .encodeABI();
    // txObject.gasLimit = web3.utils.toHex(config.GAS.ERC1155.MINTING.RESERVE);
  } else {
    // call mint function in contract if there is only one token
    txObject.data = myContract.methods
      .mint(
        toAddress,
        tokenId,
        "1",
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      )
      .encodeABI();
    // txObject.gasLimit = web3.utils.toHex(config.GAS.ERC1155.MINTING.RESERVE);
  }
};

const erc721MintObject = async (data, txObject) => {
  const toAddress = data.toAddress;
  const tokenId = data.tokenId;
  const royaltyReceiver = data.royaltyReceiver;
  const royaltyPercentage = data.royaltyPercentage;
  const metaHash = data.metaHash;
  console.log("data:", data);

  const myContract = new web3.eth.Contract(erc721contractAbi, contractAddress);
 // const metaHash = await getTokenMetaHash(tokenId);  //ipfs will be sending from frontend.

  txObject.data = myContract.methods
    .mint(toAddress, tokenId, metaHash, 
      { account: royaltyReceiver, percentage: royaltyPercentage },
    )
    .encodeABI();
  // txObject.gasLimit = web3.utils.toHex(config.GAS.ERC721.MINTING.RESERVE);
};

const mintNFT = async (data) => {
  var txObject = {};

  const orderId = data.orderId ? data.orderId : null;

  txObject.to = contractAddress;
  txObject.value = "0x";

  switch (CONTRACT_TYPE) {
    case config.CONTRACT_TYPE.ERC1155:
      erc1155MintObject(data, txObject);
      break;
    case config.CONTRACT_TYPE.ERC721:
      await erc721MintObject(data, txObject);
      break;
    default:
      return;
  }

  const txSerialized = await createTx(txObject, web3, network);

  web3.eth
    .sendSignedTransaction(txSerialized)
    .on("transactionHash", async (txHash) => {
      console.log("Transfer completed", {
        txHash: txHash,
      });

      await sendTxData(
        {
          txhash: txHash,
          tokenId: data.tokenId,
          orderId: orderId,
          type: "mint",
        },
        "/v1/asset/order/orderTx"
      );
      await sendTxDataToAdmin(
        {
          txhash: txHash,
          tokenId: data.tokenId,
          orderId: orderId,
          type: "mint",
        },
        "/v1/admin/asset/minting/callback"
      );
    })
    .on("error", async (error) => {
      await init(adminAddress, web3, network);
      console.log(error);
    });

  return true;
};

module.exports ={ mintNFT, getTokenMetaHash};
