// hexadecimal prefix value
const HEX_PREFIX = "0x";

// convert hex id value to decimal string
module.exports.hexToInt = (hexId) => {
  if (!hexId || !(typeof hexId === "string")) throw TypeError;

  if (hexId.substring(0, 2) !== HEX_PREFIX) hexId = HEX_PREFIX + hexId;

  return parseInt(hexId).toString();
};
