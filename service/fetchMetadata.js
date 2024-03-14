const {web3} = require("./web3");
const erc721contractAbi = require("../config/erc721abi.json");
const axios = require("axios");
const config = require("../config");

const {
  NonExistingTokenException,
  UnsupportedContractException,
  InvalidTokenIdException
} = require("../utilities/customError");

const normalize = (uri) => {
  if (uri.substring(0, 4).toLowerCase() == "ipfs") {
    return config.PINATA.URL + uri.substring(7, uri.length);
  }
  return uri;
};

const getERC721Meta = async (data) => {
  const contractAddress = data.contract;
  const tokenId = data.tokenId;

  try {
    const erc721TokenContract = new web3.eth.Contract(
      erc721contractAbi,
      contractAddress
    );
    const tokenURI = await erc721TokenContract.methods.tokenURI(tokenId).call();
    const tokenURINormalized = normalize(tokenURI);
    const res = await axios.get(tokenURINormalized);
    return res.data;
  } catch (error) {
    if (error.message.includes("invalid BigNumber string")) {
      throw new InvalidTokenIdException(error);
    } else if (error.message.includes("URI query for nonexistent token")) {
      throw new NonExistingTokenException(error);
    } else if (error.message.includes("Returned values aren't valid")) {
      throw new UnsupportedContractException(error);
    }
    throw Error(error);
  }
};

module.exports = getERC721Meta;
