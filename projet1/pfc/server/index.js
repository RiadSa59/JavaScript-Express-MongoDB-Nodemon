import { Server as ServerIO } from 'socket.io';
import SocketController from './controllers/socketController.js';
import http from 'http';
import RequestController from './controllers/RequestController.js';

const server = http.createServer(
	(request, response) => new RequestController(request, response).handleRequest()
);

// server.listen(8080);
const io = new ServerIO(server);
const socketController = new SocketController(io);

console.log("Starting to listen")

server.listen(8080);

console.log("== IO ==")
io.on('connection', socket => {
	socketController.register(socket);
});
