import {URL} from 'url';
import ResponseBuilder from "./ResponseBuilder.js";
import {readFileSync} from 'fs';


export default class Router {

    #request;
    #response;
    #url;
    #responseBuilder;

    constructor(request, response) {
        this.#request = request;
        this.#response = response;
        this.#url = new URL(request.url, `http://${request.headers.host}`);
    }

    handleRequest() {
        this.prepareResponse();
        this.buildResponse();
    }

    prepareResponse() {
        this.#responseBuilder = new ResponseBuilder();
    }

    buildResponse() {
        const path = this.#url.pathname;

        if (path === "/") {
            this.#responseBuilder.setHeader("homemade");
            this.#responseBuilder.setContent("Live Server");
        } else if (path === "/first") {
            this.#responseBuilder.setHeader("html");
            this.#responseBuilder.addStyle("./public/style/style.css");
            this.#responseBuilder.setContent("<h1>That's the `/first` </h1>");
        } else if (path === "/second") {
            this.#responseBuilder.setHeader("html");
            this.#responseBuilder.setContent("<h1>That's the `/second`</h1>");
        } else if (path === "/json") {
            this.#responseBuilder.setHeader("json");
            this.#responseBuilder.setContent(this.#url.searchParams);
        } else if (path === "/random") {
            this.#responseBuilder.setHeader("json");
            const params = new Map();
            params.set("random_value", Math.floor(Math.random() * 100))
            this.#responseBuilder.setContent(params);
        } else if (path.startsWith("/public")) {
            this.#responseBuilder.setHeader(path.split('.')[-1]);
            this.#responseBuilder.setContent(`.${path}`);
        } else {
            this.#responseBuilder.setCode(404);
            this.#responseBuilder.setHeader("html");
            this.#responseBuilder.setContent(`<h1>Not found !</h1>`);
        }
        this.#responseBuilder.retrieveResponse(this.#response).end();
    }
}