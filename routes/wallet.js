'use strict';

const express = require('express');
const router = express.Router();

const {
  createWallet, coinTransfer
} = require('../modules/wallet-management/walletController');
const { adminTransfer } = require('../middleware/adminTransfer')

router.get('/', createWallet);
router.post('/withdraw-transfer', adminTransfer, coinTransfer)


module.exports = router;
