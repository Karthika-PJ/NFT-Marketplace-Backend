const del = require("del");

const deletefile = (filePath) => {
  del([filePath]);
};

module.exports = deletefile;
