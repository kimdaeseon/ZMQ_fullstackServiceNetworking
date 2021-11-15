const zmq = require("zeromq");

const app = async ()=>{
    const socket = new zmq.Request;
    await socket.connect("tcp://127.0.0.1:5555");
    for (let request = 0; request < 10; request++){
        console.log("Sending request", request, "...")
        await socket.send("Hello")

        const [msg] = await socket.receive()
        console.log("Received reply", request, "[", msg.toString(), "]")
        await new Promise(resolve=>setTimeout(resolve, 1000))
    }
}

app()









