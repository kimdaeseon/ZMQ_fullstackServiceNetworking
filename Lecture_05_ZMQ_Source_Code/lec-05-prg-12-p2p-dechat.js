const zmq = require('zeromq')
const {Worker} = require('worker_threads')
const ip = require('ip')

const search_nameserver = async (ip_mask, local_ip_addr, port_nameserver) =>{
    const subscribeSocket = new zmq.Subscriber
    result = ""
    for (let i = 0 ; i < 4; i++){
        let target_ip_addr = "tcp://"+String(ip_mask)+"."+String(i)+":"+port_nameserver
        if(target_ip_addr != local_ip_addr){
            subscribeSocket.connect(target_ip_addr)
        }
        subscribeSocket.receiveTimeout = 200
        subscribeSocket.subscribe("NAMESERVER")
        await subscribeSocket.receive().then((msg)=>{
            result = msg.toString()
        }, (error) => {
            result = ""
        })
        if (result != ""){
            return result
        }
    }
}

const beacon_nameserver = async (local_ip_addr, port_nameserver)=>{
    const publishSocket = new zmq.Publisher
    await publishSocket.bind("tcp://"+local_ip_addr+":"+port_nameserver)
    console.log("loacl p2p name server bind to tcp://"+local_ip_addr+":"+port_nameserver+".")
    while(true){
        await new Promise(resolve=>setTimeout(resolve, 1000))
        const msg = "NAMESERVER:"+local_ip_addr
        publishSocket.send(msg)
    }
}

const user_manager_nameserver = async (local_ip_addr, port_subscribe)=>{
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

const relay_server_nameserver = async (local_ip_addr, port_chat_publisher, port_chat_collector)=>{
    const publishSocket = new zmq.Publisher
    await publishSocket.bind("tcp://"+local_ip_addr+":"+port_chat_publisher)
    const pullSocket = new zmq.Puller
    await pullSocket.bind("tcp://"+local_ip_addr+":"+port_chat_collector)
    console.log("local p2p relay server activated at" + "tcp://"+local_ip_addr+":"+port_chat_publisher +"&" + port_chat_collector)

    while(true){
        const raw_message = await pullSocket.receive()
        const message = raw_message.toString()
        console.log("p2p-relay:<==>", message)
        publishSocket.send("RELAY:" + message)
    }
}

const get_local_ip = ()=>{
    return ip.address()
}

const app = async (argv)=>{
    let ip_addr_p2p_server = ""
    const port_nameserver = 9001
    const port_chat_publisher = 9002
    const port_chat_collector = 9003
    const port_subscribe = 9004

    const user_name = argv[2]
    const ip_addr = get_local_ip()
    const splited_addr = ip_addr.split(".")
    splited_addr.pop()
    const ip_mask = splited_addr.join(".")

    console.log("searching for p2p server .")

    const name_server_ip_addr = await search_nameserver(ip_mask, ip_addr, port_nameserver)
    if(!name_server_ip_addr){
        ip_addr_p2p_server = ip_addr
        console.log("p2p server is not found, and p2p server mode is activated.")
        new Worker("./beacon_worker.js", {workerData : {local_ip_addr:ip_addr, port_nameserver:port_nameserver}})
        console.log("p2p beacon server is activated.")
        new Worker("./user_manage_worker.js", {workerData : {local_ip_addr:ip_addr, port_subscribe:port_subscribe}})
        console.log("p2p subsciber database server is activated.")
        new Worker("./relay_worker.js", {workerData : {local_ip_addr:ip_addr, port_chat_publisher:port_chat_publisher, port_chat_collector:port_chat_collector}})
        console.log("p2p message relay server is activated.")
    }
    else{
        ip_addr_p2p_server = name_server_ip_addr
        console.log("p2p server found at" + ip_addr_p2p_server + ", and p2p client mode is activated.")
    }

    console.log("starting user registration procedure.")

    const p2p_rx = new zmq.Subscriber
    p2p_rx.subscribe("RELAY")
    p2p_rx.receiveTimeout = 100
    p2p_rx.connect("tcp://"+ip_addr_p2p_server+":"+port_chat_publisher)
    const p2p_tx = new zmq.Push
    p2p_tx.connect("tcp://"+ip_addr_p2p_server+":"+port_chat_collector)
    
    console.log("starting autonomous message transmit and receive scenario. ")

    while(true){
        await p2p_rx.receive().then((raw_message)=>{
            const message = raw_message.toString().split(":")
            console.log("p2p-recv::<<==", message[1] + ":" + message[2])
        }, (error)=>{

        })
        await new Promise(resolve=>setTimeout(resolve, 3000))
        let randomInt = getRandomInt(1, 100)
        if (randomInt < 10){
            msg = "(" + user_name + "," + ip_addr + ":ON)"
            p2p_tx.send(msg)
            console.log("p2p-send::==>>", msg)
        }
        else if (randomInt > 90){
            msg = "(" + user_name + "," + ip_addr + ":OFF)"
            p2p_tx.send(msg)
            console.log("p2p-send::==>>", msg)
        }
    }

    function getRandomInt(min, max) {
        return parseInt(Math.random() * (max - min) + min)
    }
}

app(process.argv)