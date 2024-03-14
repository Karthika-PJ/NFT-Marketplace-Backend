const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const NFTMarketplace = artifacts.require('AshlyNFTMarketplaceUpgradable');
// rootadmin, [maintainer address, sendery cmmission in 2 decimals], primary commission in 2 decimals, nft contract address
module.exports = async function (deployer, network, accounts) {
    const rootAdmin = accounts[0];
  await deployProxy(NFTMarketplace, ["0x3AE2Dc34b914D509E6C71e719A8559F09db034bB", ["0x33Dc92a5EcfA6A9755b7951623a58a503422828c", 200], 200, "0x026368208bf469E2688C710c20139739ED253E29"], { deployer });
};


