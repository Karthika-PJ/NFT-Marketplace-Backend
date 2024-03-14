function verifyAPIKey(req, res, next) {
  let apiKey = req.headers['x-api-key']

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).send({
      success: false,
      message: 'API key is not valid.',
    })
  }

  next()
}

module.exports = { verifyAPIKey }
