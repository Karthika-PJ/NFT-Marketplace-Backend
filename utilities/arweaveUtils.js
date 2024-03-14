const Arweave = require("arweave");
const config = require("../config");
const fs = require("fs");
var mime = require('mime-types');

const key = config.ARWEAVE.API_KEY;

const arweave = Arweave.init({
  host: "arweave.net", // Hostname or IP address for a Arweave host
  port: 443, // Port
  protocol: "https", // Network protocol http or https
  timeout: 20000, // Network request timeouts in milliseconds
  logging: false, // Enable network request logging
});

const saveFileToArweave = async (data) => {
  try {
    let fileData = fs.readFileSync(data.path);
    let fileType =  mime.lookup(data.path)
    let transaction = await arweave.createTransaction({ data: fileData }, key);
    transaction.addTag('Content-Type', fileType);

    await arweave.transactions.sign(transaction, key);

    let uploader = await arweave.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      // console.log(
      //   `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
      // );
    }
    // console.log(transaction);
    return transaction;
  } catch (e) {
    console.error(e);
    return false;
  }
};

const saveJSONToArweave = async (json) => {
  try {
    data = JSON.stringify({ json });

    let transaction = await arweave.createTransaction(
      {
        data: data,
      },
      key
    );
    transaction.addTag('Content-Type', 'application/json');

    await arweave.transactions.sign(transaction, key);

    const response = await arweave.transactions.post(transaction);

    // console.log(transaction);
    return transaction;
  } catch (e) {
    console.error(e);
    return false;
  }
};

// const testIPFSAuth = () => {
//   pinata
//     .testAuthentication()
//     .then((result) => {
//       console.log("IPFS Auth");
//       console.log(result);
//     })
//     .catch((err) => {
//       console.log("IPFS Error");
//       console.log(err);
//     });
// };

module.exports = {
  // testIPFSAuth,
  saveFileToArweave,
  saveJSONToArweave,
};
