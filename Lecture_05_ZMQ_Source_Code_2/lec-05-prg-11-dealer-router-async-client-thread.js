const zmq = require('zeromq')

class ClientTask{
    constructor(_id){
        this.id = _id
    }

    async run(){
        const reqSocket = zmq.socket("req")
        const identity = this.id 
        reqSocket.connect("tcp://127.0.0.1:5570")
        console.log("Client", identity, "started")
        let count = 0
        reqSocket.on("message", (msg)=>{
            console.log(identity, "received:", msg.toString())
        })
        const sending = setInterval(() => {
            count = count + 1
            console.log("REQ #", count, "send ...")
            reqSocket.send("request #"+String(count)+" from "+identity)
        }, 1000);
    }
}

const app = function(){
    const client = new ClientTask(process.argv[2])
    client.run()
}

app()