const {parentPort, workerData} = require('worker_threads')
const zmq = require("zeromq")

class ServerWorker{
    constructor(){
    }
    async run(){
        this.relay_server_nameserver(workerData.local_ip_addr, workerData.port_chat_publisher, workerData.port_chat_collector)
    }
    async relay_server_nameserver(local_ip_addr, port_chat_publisher, port_chat_collector){
        const publishSocket = new zmq.Publisher
        await publishSocket.bind("tcp://"+local_ip_addr+":"+port_chat_publisher)
        const pullSocket = new zmq.Pull
        await pullSocket.bind("tcp://"+local_ip_addr+":"+port_chat_collector)
        console.log("local p2p relay server activated at" + "tcp://"+local_ip_addr+":"+port_chat_publisher +"&" + port_chat_collector)

        while(true){
            const raw_message = await pullSocket.receive()
            const message = raw_message.toString()
            console.log("p2p-relay:<==>", message)
            publishSocket.send("RELAY:" + message)
        }
    }
}

const app = function(){
    worker = new ServerWorker()
    worker.run()
}

app()