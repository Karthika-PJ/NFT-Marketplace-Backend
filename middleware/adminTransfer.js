function adminTransfer(req, res, next) {
  req.body.fromAddress = process.env.ADMIN_ADDRESS;
  next()
}

module.exports = { adminTransfer }
