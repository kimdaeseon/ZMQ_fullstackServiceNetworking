const zmq = require('zeromq')

class ClientTask{
    constructor(_id){
        this.id = _id
    }

    async run(){
        const dealerSocket = new zmq.Dealer 
        const identity = this.id 
        dealerSocket.routingId = String(identity)
        dealerSocket.connect("tcp://127.0.0.1:5570")
        dealerSocket.receiveTimeout = 500
        console.log("Client", identity, "started")
        let count = 0
        while(true){
            count = count + 1
            console.log("REQ #", count, "send ...")
            dealerSocket.send("request #"+String(count))
            await new Promise(resolve=>setTimeout(resolve, 1000))
            const success = function(msg){
                console.log(identity, "received:", msg.toString())
            }
            const fail = function(msg) {

            }
            dealerSocket.receive().then(success, fail)
        }
    }
}

const app = function(){
    const client = new ClientTask(process.argv[2])
    client.run()
}

app()