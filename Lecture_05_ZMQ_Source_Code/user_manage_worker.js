const {parentPort, workerData} = require('worker_threads')
const zmq = require("zeromq")

class ServerWorker{
    constructor(){
    }
    async run(){
        this.user_manager_nameserver(workerData.local_ip_addr, workerData.port_subscribe)
    }
    async user_manager_nameserver(local_ip_addr, port_subscribe){
        const user_db = []
        const replySocket = new zmq.Reply
        await replySocket.bind("tcp://"+local_ip_addr+":"+port_subscribe)
        console.log("local p2p db server activated at" + "tcp://"+local_ip_addr+":"+port_subscribe)
        while(true){
            const raw_user_request = await replySocket.receive()
            const user_request = raw_user_request.toString().split(":")
            user_db.push(user_request)
            console.log("user registration '" + user_request[1] + "' from '" + user_request[0] +"'.")
            replySocket.send("ok")
        }
    }
}


const app = function(){
    worker = new ServerWorker()
    worker.run()
}

app()