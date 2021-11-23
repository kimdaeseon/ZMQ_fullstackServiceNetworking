const zmq = require("zeromq")

const app = async function(){
    const subscribeSocket = new zmq.Subscriber
    subscribeSocket.connect("tcp://127.0.0.1:5557")
    subscribeSocket.subscribe("")
    subscribeSocket.receiveTimeout = 100
    const pushSocket = new zmq.Push
    pushSocket.connect("tcp://127.0.0.1:5558")

    while (true){
        await subscribeSocket.receive().then((msg)=>{
            console.log("I : receive message", msg.toString())
        }, ()=>{
            let randomInt = getRandomInt(1, 100)
            if (randomInt < 10){
                pushSocket.send(randomInt)
                console.log("I: sending message", randomInt)
            }
        })
    }
    function getRandomInt(min, max) {
        return parseInt(Math.random() * (max - min) + min)
    }
}

app()


