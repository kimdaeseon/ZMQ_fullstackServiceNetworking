const zmq = require("zeromq")

const getZipFilter = function(argv){
    if(argv.length > 2) return process.argv[2]
    else return "10001"
}

const run = async function(){
    let total_temp = 0
    let counter = 0
    const zip_filter = getZipFilter(process.argv)
    const socket = new zmq.Subscriber
    await socket.connect("tcp://127.0.0.1:3000")
    socket.subscribe(zip_filter)

    for await (const [zipcode, temperature, relhumidity] of socket) {
        total_temp += parseInt(temperature.toString())
        counter += 1
        console.log("Receive temperature for zipcode", "'", zip_filter, "'", "was", temperature.toString(), "F")
        if (counter == 20) break
    }

    console.log("Average temperature for zipcode", "'", zip_filter, "'", "was", total_temp / counter, "F")

}

run()