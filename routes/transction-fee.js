'use strict';

const express = require('express');
const router = express.Router();

const {getTransactionFee} = require('../modules/transaction-details/transactionController');

router.get('/:transactionId', getTransactionFee);


module.exports = router;