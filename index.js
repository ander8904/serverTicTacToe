var debug = require("debug")("socketio-server:server");

const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

//const PORT = process.env.PORT || 9000;
var port = normalizePort(process.env.PORT || "9000");
const INDEX = '/index.html';

const app = express()
app.use((_req, res) => res.sendFile(INDEX, { root: __dirname }))

const server = app.listen(port, () => console.log(`Listening on http://localhost:${port}...`));
server.on("listening", onListening);

// socket server
const socket = require('socket.io');
const io = socket(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log("New Socket connected: ", socket.id);
    socket.on('reqTurn', (data) => {
        const room = JSON.parse(data).room
        io.to(room).emit('playerTurn', data)
    })

    socket.on('create', room => {
        socket.join(room)
    })

    socket.on('join', room => {
        socket.join(room)
        io.to(room).emit('opponent_joined')
    })

    socket.on('reqRestart', (data) => {
        const room = JSON.parse(data).room
        io.to(room).emit('restart')
    })
});

 
function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
  
    console.log("Server Running on Port: ", port);
  }