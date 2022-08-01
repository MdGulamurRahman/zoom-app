const express = require("express");
const socket = require("socket.io");
const http = require("http");
const app = express()
app.use(express.static('js'))
const httpServer = http.createServer(app);
const io = new socket.Server(httpServer);

app.get("/", (req,res)=>{
    res.sendFile(`${__dirname}/room.html`)
});
//start socket 
io.on("connection", (socket)=>{
    //get online users
    const getOnlineUsers = async ()=>{
        const activeUserSockets = io.sockets.sockets;
        const sids = io.sockets.adapter.sids;
        const activeUserArray = [...sids.keys()];
        const activeUser = [];
        activeUserArray.forEach(userId =>{
            const userSocket = activeUserSockets.get(userId);
            if(userSocket.name){
                activeUser.push({
                    id: userSocket.id,
                    name: userSocket.name
                })
            }
        });
        return activeUser;

    }
    //set name
    socket.on("setName", async (name, cb)=>{
        socket.name = name;
        cb()
        const activeUsers = await getOnlineUsers();
        socket.emit("get_active_users", activeUsers)

    });
    socket.on("disconnect", async()=>{
        const activeUsers = await getOnlineUsers();
        console.log(activeUsers)
    })
});

//server listening
httpServer.listen(3000, ()=>{
    console.log("server is running");
})