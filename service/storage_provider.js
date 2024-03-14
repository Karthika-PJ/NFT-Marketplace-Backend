const storage_type = process.env.STORAGE_PROVIDER;

const getStorageOptions = () => {
  switch (storage_type) {
    case "IPFS":
      storage_option_url = "../modules/IPFSManagement";
      return storage_option_url;
    case "ARWEAVE":
      storage_option_url = "../modules/arweave-management";
      return storage_option_url;
    default:
      throw Error("Unsupported Storage Type!");
  }
};
storage_option_url = getStorageOptions();
module.exports = storage_option_url;
