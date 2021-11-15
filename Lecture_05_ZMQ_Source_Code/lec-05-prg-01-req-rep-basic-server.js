const zmq = require("zeromq");

const socket = zmq.socket("rep")
socket.bind("tcp://127.0.0.1:5555");

socket.on("message", function(msg){
	console.log("Received request:", msg.toString())
	socket.send("World")
})

