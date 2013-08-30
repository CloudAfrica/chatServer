var express = require('express');

var app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser());

var timeline = [];
var count = 0;

/**
 * CORS support.
 */

app.all('*', function(req, res, next){
  // if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

app.get('/', function(req, res) {
	res.send('Chat Server v 0.1');
})

app.post('/messages', function(req,res) {
    var data =  req.body;
	data.id = count++;
	console.log(data);
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