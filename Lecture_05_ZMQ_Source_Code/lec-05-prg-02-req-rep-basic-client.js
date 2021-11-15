const zmq = require("zeromq");

const socket = zmq.socket("req");
const addr = "tcp://127.0.0.1:5555"
socket.connect(addr);
let times = 0

socket.on("message", function(msg){
	console.log("Received reply", times, "[", msg.toString(), "]");
        times = times + 1
})

const app = (addr)=>{
    const sendMessage = setInterval(function(){
        console.log("Sending request", times, "…");
        socket.send("Hello")
    }, 1000);
    const finishTimer = setTimeout(function(){
        clearTimeout(sendMessage);
        socket.disconnect("tcp://127.0.0.1:5555")
    }, 11000);
}

app()









