"use strict";

const dbConstants = require("./dbConstants.json");
const arweaveKey = require("./arweaveKey.js");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  ADMIN_WALLET_MIN_BALANCE: 200000000000000000,
  DB_CONSTANTS: dbConstants,
  ADMIN_ADDRESS: process.env.ADMIN_ADDRESS,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  AUCTION_CONTRACT_ADDRESS: process.env.AUCTION_CONTRACT_ADDRESS,
  NETWORK: process.env.NETWORK,
 
  HTTP_STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
  },
  JWT: {
    PAYLOAD: {
      name: "sample",
    },
    SECRET_KEY: "secretKey",
  },
  SECRETS: {
    SALT_ROUNDS: 10,
  },

  PINATA: {
    API_KEY: process.env.PINATA_API_KEY,
    API_SECRET: process.env.PINATA_API_SECRET,
    URL: "https://gateway.pinata.cloud/ipfs/",
  },

  ARWEAVE: {
    API_KEY: arweaveKey.KEY,
    URL: "https://arweave.net/",
  },
  STORAGE_TYPE: process.env.STORAGE_PROVIDER || "IPFS",
  WOO: {
    API_URI: process.env.WOO_WP_API_URI,
    API_AUTH: process.env.WOO_WP_API_AUTH
  },

  CONTRACT_TYPE: {
    ERC721: "ERC721",
    ERC1155: "ERC1155",
  },

  QUEUE: {
    minting: "minting_prod",
    transfering: "transfering_prod",
    endingAuction: "endingAuction_prod",
    startAuction: "startAuction_prod",
    mintAndTransfer: "mintAndTransfer_prod",
    updateMaintainer: "updateMaintainer_prod",
  },

  GAS: {
    ETH_TRANSFER: 21000,
    ERC1155: {
      MINTING: {
        RESERVE: 250000,
        CONSUME: 250000,
      },
      TRANSFERING: {
        RESERVE: 250000,
        CONSUME: 250000,
      },
    },
    ERC721: {
      MINTING: {
        RESERVE: 280000,
        CONSUME: 261000,
      },
      TRANSFERING: {
        RESERVE: 250000,
        CONSUME: 105000,
      },
      ENDING_AUCTION: {
        RESERVE: 250000,
        CONSUME: 105000,
      },
    },
  },
};
