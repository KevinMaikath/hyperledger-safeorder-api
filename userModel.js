// dummy user list, for testing purposes
// user information should be stored outside this project
const users = [
    {
        username: 'isabella',
        password: 'isabella'
    },
    {
        username: 'balaji',
        password: 'balaji'
    }
];

function getUserByUsername(username) {
    return users.find(user => user.username === username);
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
    checkPassword
};
