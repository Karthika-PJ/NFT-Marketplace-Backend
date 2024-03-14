var crypto = require('crypto');

module.exports.hashUtils = async (data) => {
  return await crypto.createHash('sha256').update(data).digest('base64');
};

module.exports.hashWithOptions = async (data, algorithm, digest) => {
  return await crypto.createHash(algorithm).update(data).digest(digest);
};
