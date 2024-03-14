'use strict'

const Wallet = require('../../mongoModels/wallet')

const addWallet = (data) => {
  return Wallet.create(data)
}

const getWallet = (queryParams) => {
 
  return Wallet.findOne(queryParams)
}


module.exports = {
  addWallet,
  getWallet,
}
