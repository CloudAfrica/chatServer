/*
-----------------------------
[Pre-requisites]
npm install uuid
npm install structure.js
-----------------------------
[Commands]
/Join
Parameters: username
Returns a signed on token

/Postmessage
Parameters: signed on token, message

/Get
Returns: all messages in format (username, datetime of message, message)

/Leave
Parameters: signed on token
Returns: OK
*/

var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    uuid = require('uuid'),
    Users = require('./userList').Users,
    MessageList = require('./messageList').MessageList;

var serverName;
var HOSTNAME = require('os').hostname();
var PORT = 8124;
var messageStack = new MessageList();
var users = new Users();
var URI = HOSTNAME + ':' + PORT;

http.createServer(function (req, res) {
    showURLDetails(req);
    routeCommand(req, res);
    res.end("end...");
}).listen(PORT);
console.log('Server running at http://%s/ at %s', URI, new Date().toISOString());

http.createServer(function (req, res) {
    displayMessages(res);
}).listen(8125);

function showURLDetails(req) {
    console.log("showURLDetails ::: ");
    console.log("      url:" + req.url);

    var url_parts = url.parse(req.url, true);
    console.log("      pathname:" + url_parts.pathname);
    console.log("      query:" + url_parts.query);
    console.log("      params:" + req.params);
    console.log("      querystring bob:" + url_parts.query.name);
    console.log("      querystring id:" + url_parts.query.id);
    console.log("      body:" + req.body);
}

function displayMessagesJSON(res) {
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    var body = null;
    var output = null;
    var tempStack = null;
    if (messageStack.length > 0) {
        tempStack = messageStack.reverseStack();
        output = {
            Success: true,
            Message: 'Added',
            Data: tempStack
        };
    }
    else {
        output = {
            Success: true,
            Message: 'Added',
            Data: "No messages."
        };
    }
    body = JSON.stringify(output);

    res.write(body);

    res.end("end...");
}

function displayMessages(res) {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    var body = null;
    var output = null;
    var tempStack = null;
    if (messageStack.length > 0) {
        tempStack = messageStack.reverseStack();
        output = {
            Success: true,
            Message: 'Added',
            Data: tempStack
        };
    }

    if (output != null) {
        console.log('[displayMessages] contains messages');

        body = JSON.stringify(output);

        var jsonObj = eval('(' + body + ')');

        var htmlOut = null;

        if (jsonObj != undefined) {
            htmlOut =
                '<!DOCTYPE html>' +
                '<html>' +
                '<body>' +
                '<h2>Chat Server</h2>' +
                '<p>';
            for (var index in jsonObj) {
                if (index == 'Data') {
                    var dataObj = JSON.stringify(jsonObj[index]);
                    var item = eval('(' + dataObj + ')');
                    if (item != undefined) {
                        for (var index2 in item) {
                            htmlOut += '[User] ' + item[index2].User + ' [Date] ' + item[index2].DateTime + ' [Message] ' + item[index2].Message + ' <br /> ';
                        }
                    }
                    else {
                        htmlOut += "No messages.";
                    }
                }
            }
            htmlOut +=
                '</p>' +
                '</body>' +
                '</html>';
        }
        res.write(htmlOut);
    }

    res.end("end...");
}

function routeCommand(req, res) {
    var reqUrl = req.url.toLowerCase();

    console.log('[routeCommand] reqUrl ' + reqUrl);
    if (reqUrl.indexOf('/join') > -1) {
        joinChat(req, res);
    }
    else if (reqUrl.indexOf('/postmessage') > -1) {
        postMessage(req, res);
    }
    else if (reqUrl.indexOf('/get') > -1) {
        getMessages(req, res);
    }
    else if (reqUrl.indexOf('/leave') > -1) {
        leaveChat(req, res);
    }
    else {
        console.log("No commands recognised.");
    }
}

function parseUserFromUrl(req) {
    var reqUrl = req.url;
    var parameterIndex = reqUrl.indexOf('?') + 1;
    var user = null;

    // check to see that there is a user name in the url specified after the ?
    if (parameterIndex != reqUrl.length) {
        user = reqUrl.substring(parameterIndex, reqUrl.length);
    }
    console.log('[parseUserFromUrl] [%s]', user);
    return user;
}


function joinChat(req, res) {
    var user = parseUserFromUrl(req);
    var token = uuid.v4().toString();

    console.log('[joinChat] Debug user=%s token=%s', user, token);

    if (user != null) {
        if (!users.containsUser(user)) {
            users.addUser(user, token);
            console.log("[joinChat] New user '%s' has joined the chat", user);
            messageStack.add({ User: user, DateTime: new Date().toISOString(), Message: 'has joined the chat.' });

        }
        else {
            console.log("already logged in");
        }
        res.writeHead(302, {
            'Location': 'http://' + URI + '/' + token + '/postMessage?'
        });
        res.end();
    }
}

function postMessage(req, res) {
    var token = validateToken(req, res);
    var msg = req.url.replace("/" + token + "/postMessage?", '');
    var user = users.getUserByToken(token);
    console.log('[postMessage] token=%s user=%s msg=%s', token, user, msg);

    if (msg.trim() != "") {
        messageStack.add({ User: user, DateTime: new Date().toISOString(), Message: msg });
    }
    res.writeHead(302,
        'http://' + URI + '/' + token + '/postMessage?'
    );
    res.end();
}

function getMessages(req, res) {
    console.log("[getMessages] get");
    var token = validateToken(req, res);
    displayMessagesJSON(res);
}

function leaveChat(req, res) {
    console.log("[leaveChat] leave");
    var token = validateToken(req, res);
    var user = users.getUserByToken(token);
    users.removeToken(token);
    if (user != undefined) {
        messageStack.add({ User: user, DateTime: new Date().toISOString(), Message: 'has left the chat.' });
        console.log('User %s has left the chat.', user);
    }
    res.writeHead(303, {
        'Location': 'http://' + URI + '/join?'
    });
    res.end("User has left the chat.");
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) == str;
    };
}

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str) {
        return this.slice(-str.length) == str;
    };
}

// Validates the token by 
// 1. Retrieving the token from the URL.
// 2. Checking to see if the token exists within the userlist.
// 3. If valid returns the token.
function validateToken(req, res) {
    var token = getToken(req);
    var user = users.getUserByToken(token);
    var isValidToken = user != undefined && user != '';
    console.log('[validToken] req=' + req.url);
    console.log('[validToken] Is Valid Token=%s User=%s', isValidToken, user);
    if (!isValidToken) {
        invalidToken(req, res);
    }
    return token;
}

var getToken = function (req) {
    var token = req.url.toLowerCase().split('/')[1];
    return token;
}

function invalidToken(req, res) {
    console.log('[invalidToken]')
    console.log(res);
    res.writeHead(303, {
        'Location': 'http://' + URI + '/join?'
    });
    res.end("Not valid user.");
}
