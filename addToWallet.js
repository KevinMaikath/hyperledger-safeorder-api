'use strict';

const fs = require('fs');
const {Wallets} = require('fabric-network');
const path = require('path');

const fixtures = path.resolve(__dirname, '../../test-network');

async function addToWalletIsabella() {
    try {
        // Locate the wallet
        const wallet = await Wallets.newFileSystemWallet('../organization/magnetocorp/identity/user/isabella/wallet');

        // Get the certificate
        const credPath = path.join(fixtures, '/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com');
        const certificate = fs.readFileSync(path.join(credPath, '/msp/signcerts/User1@org2.example.com-cert.pem')).toString();
        const privateKey = fs.readFileSync(path.join(credPath, '/msp/keystore/priv_sk')).toString();

        // Create a wallet Identity
        const identityLabel = 'isabella';
        const identity = {
            credentials: {
                certificate,
                privateKey
            },
            mspId: 'Org2MSP',
            type: 'X.509'
        };

        await wallet.put(identityLabel, identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

async function addToWalletBalaji() {
    try {
        // Locate the wallet
        const wallet = await Wallets.newFileSystemWallet('../organization/digibank/identity/user/balaji/wallet');

        // Get the certificate
        const credPath = path.join(fixtures, '/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com');
        const certificate = fs.readFileSync(path.join(credPath, '/msp/signcerts/Admin@org1.example.com-cert.pem')).toString();
        const privateKey = fs.readFileSync(path.join(credPath, '/msp/keystore/priv_sk')).toString();

        // Create a wallet Identity
        const identityLabel = 'balaji';
        const identity = {
            credentials: {
                certificate,
                privateKey
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        };

        await wallet.put(identityLabel, identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

async function main() {
    await addToWalletIsabella();
    await addToWalletBalaji();
}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});
