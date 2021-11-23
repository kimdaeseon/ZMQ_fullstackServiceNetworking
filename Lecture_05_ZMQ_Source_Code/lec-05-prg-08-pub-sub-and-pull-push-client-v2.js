const zmq = require("zeromq")

const app = async function(){
    const subscribeSocket = new zmq.Subscriber
    subscribeSocket.connect("tcp://127.0.0.1:5557")
    subscribeSocket.subscribe("")
    subscribeSocket.receiveTimeout = 100
    const pushSocket = new zmq.Push
    pushSocket.connect("tcp://127.0.0.1:5558")

    const clientId = getClientId(process.argv)
    
    while(true){
        await subscribeSocket.receive().then((msg)=>{
            console.log(clientId, ": receive status =>", msg.toString())
        }, ()=>{
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
        })
    }

    function getRandomInt(min, max) {
        return parseInt(Math.random() * (max - min) + min)
    }
    function getClientId(argv){
        if(argv.length > 2) return argv[2]
        else return "client#" + String(getRandomInt(1, 100))
    }
}

app()


