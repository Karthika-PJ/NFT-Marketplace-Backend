'use strict'

const Transaction = require('../../mongoModels/transaction')


const addTransaction = (data) => {
  return Transaction.create(data)
}

const getTxHistory = (address, sort) => {
  return Transaction.find({$or:[{fromAddress: address},{toAddress:address}]}).sort({"created_at":sort})
}

module.exports = {
  addTransaction,
  getTxHistory
}
