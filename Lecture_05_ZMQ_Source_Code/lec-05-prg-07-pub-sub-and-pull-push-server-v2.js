const zmq = require("zeromq")

const app = async function(){
    const publishSocket = new zmq.Publisher
    await publishSocket.bind("tcp://127.0.0.1:5557")
    const pullSocket = new zmq.Pull
    await pullSocket.bind("tcp://127.0.0.1:5558")


    while(true){
        const raw_message = await pullSocket.receive()
        const message = raw_message.toString()
        console.log("I: publishing update", message.toString())
        publishSocket.send(message)
    }
}

app()


