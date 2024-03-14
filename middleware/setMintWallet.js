function setMintWallet(req, res, next) {
  if (!req.body.toAddress) {
    req.body.toAddress = process.env.MINT_WALLET;
  }
  next();
}

module.exports = { setMintWallet };
