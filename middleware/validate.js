// const moment = require('moment');
const { check } = require('express-validator');

const validate = method => {
  switch (method) {
    
    case 'walletTransfer': {
      return [
        check("fromAddress", "fromAddress doesn't exists").exists(),
        check("toAddress", "toAddress doesn't exists").exists(),
        check("amount", "value doesn't exists").exists(),
      ]
    }

    case 'adminWalletTransfer': {
      return [
        check("toAddress", "toAddress doesn't exists").exists(),
        check("amount", "value doesn't exists").exists(),
      ]
    }
    
  }

  function isGreaterZero (value) {
    if (value <= 0) { return false; } else { return true; }
  }
};

module.exports = {
  validate
};
