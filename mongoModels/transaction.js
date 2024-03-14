'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const config = require('../config');

const transactionSchema = new Schema({
  fromAddress: String,
  toAddress: String,
  amount: String,
  txHash: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Transaction = mongoose.model('transaction', transactionSchema);
module.exports = Transaction;
