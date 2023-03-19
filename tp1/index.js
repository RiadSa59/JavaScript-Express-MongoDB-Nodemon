import http from 'http';
import Router from "./Router.js";



const server = http.createServer(
    (request, response) => {
        const router = new Router(request, response);
        router.handleRequest();
    }
);

server.listen(8080);
