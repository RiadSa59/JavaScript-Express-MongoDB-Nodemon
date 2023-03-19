import http from 'http';
import RequestController from './controllers/requestController.js';
import SocketController from './controllers/socketController.js';
import { Server as ServerIO } from 'socket.io';


const server = http.createServer(
	(request, response) => new RequestController(request, response).handleRequest()
);

const socketAndIntervals = new Map();

const io = new ServerIO(server);
const socketController = new SocketController(io);

server.listen(8080);
io.on('connection', socket => {
	socketController.register(socket);
});

