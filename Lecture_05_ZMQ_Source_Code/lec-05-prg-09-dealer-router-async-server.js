const {Worker} = require('worker_threads')
const zmq = require("zeromq")

class ServerTask{
    constructor(_numberOfServer){
        this.numberOfServer = _numberOfServer
    }
    async run(){
        const proxy = new zmq.Proxy(new zmq.Router, new zmq.Dealer)
        await proxy.frontEnd.bind("tcp://127.0.0.1:5570")
        await proxy.backEnd.bind("inproc://backend")

        const workers = []
        for (let i = 0; i < this.numberOfServer; i++){
            workers.push(new Worker('./server_worker.js', {workerData:i}))
        }

        await proxy.run()
    }
}

const app = function(){
    const server = new ServerTask(parseInt(process.argv[2]))
    server.run()
}

app()