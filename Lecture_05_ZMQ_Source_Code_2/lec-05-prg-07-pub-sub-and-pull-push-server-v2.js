const zmq = require("zeromq")

const app = async function(){
    const publishSocket = zmq.socket("pub")
    publishSocket.bindSync("tcp://127.0.0.1:5557")
    const pullSocket = zmq.socket("pull")
    pullSocket.bindSync("tcp://127.0.0.1:5558")

    pullSocket.on("message", function(msg){
        console.log("Server: publishing update => ", msg.toString())
        publishSocket.send(msg)
    })
}

app()


