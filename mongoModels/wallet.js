'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const config = require('../config');

const walletSchema = new Schema({
  publicAddress: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: Number,
    enum: Object.values(config.DB_CONSTANTS.WALLET.ROLE)
  },
  status: {
    type: Number,
    enum: Object.values(config.DB_CONSTANTS.WALLET.STATUS)
  },
  keyObject: Schema.Types.Mixed
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Wallet = mongoose.model('wallet', walletSchema);
module.exports = Wallet;
