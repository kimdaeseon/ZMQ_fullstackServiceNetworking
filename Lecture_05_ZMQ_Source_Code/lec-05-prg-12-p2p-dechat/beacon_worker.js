const {parentPort, workerData} = require('worker_threads')
const zmq = require("zeromq")

class ServerWorker{
    constructor(){
    }
    async run(){
        this.beacon_nameserver(workerData.local_ip_addr, workerData.port_nameserver)
    }
    async beacon_nameserver(local_ip_addr, port_nameserver){
        const publishSocket = new zmq.Publisher
        await publishSocket.bind("tcp://"+local_ip_addr+":"+port_nameserver)
        console.log("loacl p2p name server bind to tcp://"+local_ip_addr+":"+port_nameserver+".")
        while(true){
            await new Promise(resolve=>setTimeout(resolve, 1000))
            const msg = "NAMESERVER:"+local_ip_addr
            publishSocket.send(msg)
        }
    }
}

const app = function(){
    worker = new ServerWorker()
    worker.run()
}

app()