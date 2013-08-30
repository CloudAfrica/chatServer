# ChatServer

node.js based chat server for and AngularJs workshop 

Commands:

	/join?[Username]		Returns: a signed token
	
	/Postmessage?[Message]

 	/Get
 
	/Leave

## SimpleServer

Added a simple express based server for a polling example : 

	node server.js
	
to start

Adding messages 

	post /messages 

with a json payload e.g. 

	{ "message" : "hello world" }

Getting messages : 

	get /messages
	
Will return all messages 

	get /messages/9
	
Will get message id 9 in a restful fashion.



