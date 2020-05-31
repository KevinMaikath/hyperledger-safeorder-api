const fs = require('fs');
const yaml = require('js-yaml');
const userModel = require("./userModel");
const {Wallets, Gateway} = require('fabric-network');

/**
 * Connect to the Hyperledger Network and invoke the 'queryOrderByBuyerID' Smart Contract.
 * @param buyerID String denoting the ID of the buyer user for the query.
 */
async function queryOrderByUser(buyerID) {
    let connectionOptions = {};

    try {
        connectionOptions = await getConnectionOptions(buyerID);
    } catch (err) {
        return {
            error: true,
            message: err.message
        }
    }

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../organization/magnetocorp/gateway/connection-org2.yaml', 'utf8'));

    const gateway = new Gateway();

    try {
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
 * @param userID ID from the user registering the order.
 */
async function registerOrder(order, userID) {

    let connectionOptions = {};

    try {
        connectionOptions = await getConnectionOptions(userID);
    } catch (err) {
        return {
            error: true,
            message: err.message
        }
    }

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../organization/magnetocorp/gateway/connection-org2.yaml', 'utf8'));
    const gateway = new Gateway();

    try {
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

/**
 * Get the user's wallet as a ConnectionOptions object.
 * @param userID User to get the wallet from.
 */
async function getConnectionOptions(userID) {
    const user = userModel.getUsernameAndWallet(userID);
    if (!user) throw new Error('Error while processing user wallet');

    let wallet = await Wallets.newFileSystemWallet(user.walletPath);
    return {
        identity: user.username,
        wallet: wallet,
        discovery: {enabled: true, asLocalhost: true}
    };
}

module.exports = {
    registerOrder,
    queryOrderByUser
};
