var MessageList = (function () {
    var self = this;
    self.messageStack = [];
    self.length = 0;

    this.add = function (message) {
        self.messageStack.push(message);
        self.length = this.messageStack.length;
    }

    this.clear = function () {
        self.messageStack.clear();
        self.length = 0;
    }

    this.reverseStack = function () {
        var tempStack = [];
        // cannot use reverse() on array as it modifies the original array.
        for (var index = self.messageStack.length - 1; index >= 0; index--) {
            tempStack.push(self.messageStack[index]);
        }
        return tempStack;
    }
});

exports.MessageList = MessageList;


function displayAll(element, index, array) {
    console.log(element);
}

var msg = new MessageList();
console.log(msg.length);
msg.add('test1');
console.log(msg.length);
msg.add('test2');
console.log(msg.length);

msg.messageStack.forEach(displayAll);
console.log('messageStack');
var out = msg.reverseStack().forEach(displayAll);
console.log('reverseStack');

msg.add('test3');

msg.messageStack.forEach(displayAll);
console.log('messageStack');

var out = msg.reverseStack().forEach(displayAll);
console.log('reverseStack');
