const fs = require('fs');
const yaml = require('js-yaml');
const {Wallets, Gateway} = require('fabric-network');

/**
 * Connect to the Hyperledger Network and invoke the 'queryOrderByBuyerID' Smart Contract.
 * @param buyerID String denoting the ID of the buyer user for the query.
 */
async function queryOrderByUser(buyerID) {
    // A wallet stores a collection of identities for use
    let wallet = await Wallets.newFileSystemWallet('../organization/magnetocorp/identity/user/isabella/wallet');

    // Specify userName for network access
    const userName = 'isabella';

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../organization/magnetocorp/gateway/connection-org2.yaml', 'utf8'));

    const gateway = new Gateway();

    try {
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true}
        };

        // EXECUTION
        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);
        console.log('Use network channel: mychannel.');
        const network = await gateway.getNetwork('mychannel');
        console.log('Use the smart contract.');
        const contract = await network.getContract('safeorder', 'org.safeorder.ordercontract');
        console.log('----------------------- Smart Contract Execution ---------------------------');
        const response = await contract.submitTransaction('queryOrderByBuyerID', buyerID);
        console.log(JSON.parse(response.toString()));
        console.log('--------------------------- Transaction complete ---------------------------');
        return {
            error: false,
            payload: JSON.parse(response.toString())
        }

    } catch (err) {
        console.log(err);
        return {
            error: true,
            message: err.responses[0].response.message
        }
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

/**
 * Connect to the Hyperledger Network and invoke the 'registerOrder' Smart Contract.
 * @param order Order to be registered into the ledger.
 */
async function registerOrder(order) {
    // A wallet stores a collection of identities for use
    let wallet = await Wallets.newFileSystemWallet('../organization/magnetocorp/identity/user/isabella/wallet');

    // Specify userName for network access
    const userName = 'isabella';

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../organization/magnetocorp/gateway/connection-org2.yaml', 'utf8'));

    const gateway = new Gateway();

    try {
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true}
        };

        // EXECUTION
        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);
        console.log('Use network channel: mychannel.');
        const network = await gateway.getNetwork('mychannel');
        console.log('Use the smart contract.');
        const contract = await network.getContract('safeorder', 'org.safeorder.ordercontract');
        console.log('----------------------- Smart Contract Execution ---------------------------');
        const response = await contract.submitTransaction('registerOrder', Buffer.from(JSON.stringify(order)));
        console.log(JSON.parse(response.toString()));
        console.log('--------------------------- Transaction complete ---------------------------');
        return {
            error: false,
            payload: JSON.parse(response.toString())
        }

    } catch (err) {
        console.log(err);
        return {
            error: true,
            message: err.responses[0].response.message
        }
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

module.exports = {
    registerOrder,
    queryOrderByUser
};
