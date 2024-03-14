const argon2i = require('argon2-ffi').argon2i;

const crypto = require('crypto');

module.exports.hashPassword = async (password) => {
  if (!password) {
    return false;
  }
  const salt = await crypto.randomBytes(32);
  const hash = await argon2i.hash(password, salt);

  return {
    salt: salt,
    hashedPassword: hash
  };
};

module.exports.comparePassword = async (password, hashedPassword) => {
  if (!password) {
    return false;
  }
  return await argon2i.verify(hashedPassword, password);
};
