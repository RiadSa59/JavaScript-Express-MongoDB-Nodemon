import {readFileSync} from "fs";

export default class ResponseBuilder {
    // Fields
    #content;
    #code;
    #header;
    #stylesheets;

    // Constructor
    constructor() {
        this.#content = "";
        this.#code = 200;
        this.#header = "homemade";
        this.#stylesheets = [];
    }

    // Setters
    setContent(content) {
        this.#content = content;
    }

    setCode(code) {
        this.#code = code;
    }

    setHeader(header) {
        this.#header = header;
    }

    addStyle(styleSheet) {
        this.#stylesheets.push(styleSheet);
    }

    //Private methods used to build the response
    #buildMessage() {
        switch (this.#header) {
            case "html":
                return this.#buildHtml();
            case "json":
                return this.#buildJson();
            default:
                return this.#buildFile();
        }
    }

    #buildHtml() {
        let htmlObject = `<html lang="en">
    <head>`;

        this.#stylesheets.forEach(path => htmlObject += `<link href="${path}" rel="stylesheet" type="text/css">`);

        htmlObject += `</head>
    <body>
        ${this.#content}
    </body>
    <footer>
        ${new Date()}
    </footer>
</html>`;

        return htmlObject;
    }

    #buildJson() {
        let jsonObject = "";
        jsonObject += `{`;

        this.#content.forEach((value, name) => jsonObject += `"${name}": ${ResponseBuilder.#correctJsonValue(value)}, `);
        jsonObject += `"date": "${new Date()}" }`;

        return jsonObject;
    }

    static #correctJsonValue(value) {
        if (value instanceof String)
            return '"' + value + '"';
        return value;
    }

    #buildFile() {
        if (this.#header !== "homemade") {
            try {
                const fileContent = readFileSync(this.#content);
                this.#code = 200;
                return fileContent;
            } catch (error) {
                this.#code = error.toString().contains("no such file or directory") ? 404 : 400;
                this.#header = "~error~";
                return error.toString();
            }    
        }

        this.#header = "text/plain";
        return this.#content;
    }

    #getContentType() {
        // const lastDot = this.#header.lastIndexOf('.');
        // const extension = lastDot >= 0 ? this.#header.slice(lastDot + 1) : path;
        switch (this.#header) {
            case "png":
                return "image/png";
            case "jpg":
                return "image/jpg";
            case "jpeg":
                return "image/jpeg";
            case "json":
                return "text/json";
            case "html":
                return "text/html";
            case "css":
                return "text/css";
            default:
                return "text/plain";
        }
    }

    // Building a neat response
    retrieveResponse(response) {
        response.statusCode = this.#code;
        const messageContent = this.#buildMessage();

        response.setHeader("Content-Type", this.#getContentType());

        response.write(messageContent);

        return response;
    }
}