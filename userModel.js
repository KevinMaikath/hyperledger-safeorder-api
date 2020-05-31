// dummy user list, for testing purposes
// user information should be stored outside this project
const users = [
    {
        username: 'isabella',
        password: 'isabella',
        ID: '11111',
        walletPath: '../organization/magnetocorp/identity/user/isabella/wallet'
    },
    {
        username: 'balaji',
        password: 'balaji',
        ID: '22222',
        walletPath: '../organization/magnetocorp/identity/user/isabella/wallet'
    }
];

function getUserByUsername(username) {
    return users.find(user => user.username === username);
}

function getUsernameAndWallet(userID) {
    const user = users.find(user => user.ID === userID);
    return !!user ? {username: user.username, walletPath: user.walletPath} : null;
}

function checkPassword(username, password) {
    const user = getUserByUsername(username);
    if (user) {
        return password === user.password;
    } else {
        return false;
    }
}

module.exports = {
    getUserByUsername,
    getUsernameAndWallet,
    checkPassword
};
