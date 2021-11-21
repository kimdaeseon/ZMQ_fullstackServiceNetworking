const cluster = require('cluster')
const zmq = require("zeromq")


if (cluster.isMaster){
    const frontend = zmq.socket('router');
    const backend = zmq.socket('dealer');

    frontend.bindSync("tcp://127.0.0.1:5570");
    backend.bindSync("tcp://127.0.0.1:5571");

    const workers = []
    for (let i = 0; i < parseInt(process.argv[2]); i++){
        cluster.fork()
    }

    zmq.proxy(frontend,backend)

}else{
    const myId = cluster.worker.id
    console.log(myId, "maked!")
    const repSocket = zmq.socket("rep")
    repSocket.connect("tcp://127.0.0.1:5571")
    console.log("Worker#", myId, "started")

    repSocket.on("message", function(msg){
        console.log("Worker#", myId, "received", msg.toString())
        repSocket.send(msg.toString())
    })
}
