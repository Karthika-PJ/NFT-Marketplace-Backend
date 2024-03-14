const Web3 = require('web3');
var web3 = new Web3(`${process.env.PROVIDER_URI}`);

var web3_withdraw = new Web3(`${process.env.PROVIDER_URI_WITHDRAW}`);

module.exports = {
    web3,
    web3_withdraw
};

