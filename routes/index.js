'use strict';

const express = require('express');
const { verifyAPIKey } = require('../middleware/verifyAPIKey');
const { getGasCost } = require('../modules/wallet-management/walletController');

const router = express.Router();

const wallet = require('./wallet');
const assets = require('./assets');
const transactionFee = require('./transction-fee');
const auction = require('./auction');

router.use('/wallet', verifyAPIKey, wallet);
router.use('/assets', assets);
router.use('/get-transaction-fee', transactionFee);
router.use('/auction', auction);

router.get('/gasCost/:standard/:transactionType', verifyAPIKey, getGasCost);

module.exports = router;
