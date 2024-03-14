'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const nftAssetsSchema = new Schema({
    name: String,
    description: String,
    image: String,
    attributes: [Object],
    STORAGE_IMG_URL : String,
    STORAGE_JSON_URL : String,
    IPFS_IMG_URL : String,
    IPFS_JSON_URL : String,
    tokenId: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const NftAssets = mongoose.model('nftAssets', nftAssetsSchema);
module.exports = NftAssets;
