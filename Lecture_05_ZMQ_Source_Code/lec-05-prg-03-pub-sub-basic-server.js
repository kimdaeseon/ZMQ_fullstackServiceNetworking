const zmq = require("zeromq")




const app = async function(){
    const socket = new zmq.Publisher
    await socket.bind("tcp://127.0.0.1:3000")
    
    while(true){
        let zipcode = getRandomInt(1, 100000)
        let temperature = getRandomInt(-80, 135)
        let relhumidity = getRandomInt(10, 60)

        string = zipcode.toString() + " " + temperature.toString() + " " + relhumidity.toString()
        await socket.send([zipcode, temperature, relhumidity])

    }
    function getRandomInt(min, max) {
        return String(parseInt(Math.random() * (max - min) + min))
    }
}

app()




