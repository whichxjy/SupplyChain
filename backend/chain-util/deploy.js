const path = require('path');
const Configuration = require('nodejs-sdk/packages/api/common/configuration').Configuration;
Configuration.setConfig(path.join(__dirname, '../chain-conf/config.json'));

const web3jService = require('nodejs-sdk/packages/api/web3j/web3jService');
const service = new web3jService.Web3jService();

const contractFolderPath = path.join(__dirname, '../contract');
const contractPath = contractFolderPath + '/SupplyChain.sol';
const contractAddrPath = contractFolderPath + '/address.txt';

const fs = require('fs');

const deployContract = async () => {
    const deployResult = await service.deploy(contractPath, contractFolderPath);
    console.log('Contract Address: ' + deployResult.contractAddress);
    fs.writeFile(contractAddrPath, deployResult.contractAddress, (err) => {
        if (err) {
            throw err;
        }
    });
}

deployContract();