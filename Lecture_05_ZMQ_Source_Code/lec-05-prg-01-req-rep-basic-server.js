const zmq = require("zeromq");

const app = async function(){
	const socket = new zmq.Reply
	await socket.bind("tcp://127.0.0.1:5555");
	while(true){
		const [msg] = await socket.receive()
		console.log("Received request:", msg.toString())
		socket.send("World")
	}
}

app()




