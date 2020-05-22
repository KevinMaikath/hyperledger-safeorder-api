const fs = require('fs');
const yaml = require('js-yaml');
const {Wallets, Gateway} = require('fabric-network');

function queryOrder() {

}

async function registerOrder(cart) {
    const order = initializeOrder(cart);
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

function initializeOrder(cart) {
    cart.ID = generateID();
    cart.buyerID = '11111';
    cart.shopID = '44444';
    cart.date = new Date().toUTCString();
    return cart;
}

function generateID() {
    let num = Math.floor(Math.random() * 100000).toString();
    if (num.length < 5) {
        const len = num.length;
        for (let i = 0; i < 5 - len; i++) {
            num = '0' + num;
        }
    }
    return num;
}

module.exports = {
    registerOrder
};
