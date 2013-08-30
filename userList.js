var HashTable = require("structure.js").HashTable;

var Users = (function () {
    var usersByToken = new HashTable();
    var usersByUsername = new HashTable();

    this.getUserByToken = function (token) {
        return usersByToken.get(token);
    }

    this.getUserByUsername = function (user) {
        return usersByUsername.get(user);
    }

    this.addUser = function (user, token) {
        validateInput(user, 'User must be more than 1 character in length!');
        validateInput(token, 'token must be more than 1 character in length!');

        console.log('addUser ' + user);
        if (!this.containsToken(token)) {
            console.log('added user ' + user);
            add(user, token);
        }
        else {
            console.log('Already contains user ' + user);
        }
    }

    this.removeUser = function (user) {
        if (this.containsUser(user)) {
            removeUserByUsername(user);
            console.log(user + ' has been removed!');
        }
        else {
            console.log('User ' + user + ' does not exists in list');
        }
    }

    this.removeToken = function (token) {
        if (this.containsToken(token)) {
            removeUserByToken(token);
            console.log(token + ' has been removed!');
        }
        else {
            console.log('No token exists for ' + token);
        }
    }

    var validateInput = function (p, error) {
        var isValid = false;
        if (p.length > 1) {
            isValid = true;
        }
        else {
            throw error;
        }
        return isValid;
    }

    this.containsUser = function (user) {
        var hasUser = false;
        if (this.getUserByUsername(user) != undefined) {
            hasUser = true;
        }
        return hasUser;
    }

    this.containsToken = function (token) {
        var hasToken = false;
        if (this.getUserByToken(token) != undefined) {
            hasToken = true;
        }
        return hasToken;
    }

    var add = function (user, token) {
        usersByToken.put(token, user);
        usersByUsername.put(user, token);
    }

    var removeUserByUsername = function (user) {
        var token = usersByToken.get(user);
        usersByToken.remove(token);
        usersByUsername.remove(user);
    }

    var removeUserByToken = function (token) {
        var username = usersByToken.get(token);
        usersByToken.remove(token);
        usersByUsername.remove(username);
    }
});

exports.Users = Users;
var users = new Users();
users.addUser('abc', 'abc');
users.addUser('abc', 'abc');
users.removeUser('abc');
users.removeUser('abc');

