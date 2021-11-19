const zmq = require("zeromq")

const app = async function(){
    const subscribeSocket = zmq.socket("sub")
    subscribeSocket.connect("tcp://127.0.0.1:5557")
    subscribeSocket.subscribe("")
    const pushSocket = zmq.socket("push")
    pushSocket.connect("tcp://127.0.0.1:5558")

    const clientId = getClientId(process.argv)
    
    subscribeSocket.on("message", function(msg){
        console.log(clientId, ": receive status =>", msg.toString())
    })

    setInterval(() => {
        let randomInt = getRandomInt(1, 100)
        if (randomInt < 10){
            msg = "(" + clientId + ":ON)"
            pushSocket.send(msg)
            console.log(clientId, ": send status - activated")
        }
        else if (randomInt > 90){
            msg = "(" + clientId + ":OFF)"
            pushSocket.send(msg)
            console.log(clientId, ": send status - deactivated")
        }
    }, 1000);
    function getRandomInt(min, max) {
        return parseInt(Math.random() * (max - min) + min)
    }
    function getClientId(argv){
        if(argv.length > 2) return argv[2]
        else return "client#" + String(getRandomInt(1, 100))
    }
}

app()


