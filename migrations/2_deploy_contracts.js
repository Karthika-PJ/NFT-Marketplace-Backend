const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const NFTMarketplace = artifacts.require('NFTMarketplaceUpgradableV2');

module.exports = async function (deployer, network, accounts) {
    const rootAdmin = accounts[0];
  await deployProxy(NFTMarketplace, ["Asly", "AY", "https://gateway.pinata.cloud/ipfs/",  "0x3AE2Dc34b914D509E6C71e719A8559F09db034bB",true], { deployer });
};