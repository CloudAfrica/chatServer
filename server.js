var express = require('express');

var app = express();
app.use(express.bodyParser());

var timeline = [];
var count = 0;

app.get('/', function(req, res) {
	res.send('Chat Server v 0.1');
})

app.post('/messages', function(req,res) {
    var data =  req.body;
	data.id = count++;
	timeline.push(data);
	res.status(201);
	res.end();
	
});

app.get('/messages', function(req,res) {
	res.send(timeline);
});

app.get('/messages/:id', function(req,res) {
	res.send(timeline[req.params.id]);
});

app.listen(3030);