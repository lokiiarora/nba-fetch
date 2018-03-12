const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const _ = require("lodash");
const morgan = require("morgan");
const routeMap = require("./utils/apiConfig");

class Api {
    constructor() {
        this.app = express();
        this.baseDir = __dirname + "/data/";
    }

    initRoutes() {
        this.app.use(morgan(":method :url :status :response-time ms"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.get("/", (req,res) => {
            res.json({
                body: "Running all fine tbh"
            });
        });
        _.map(routeMap(), v => {
            this.genericRoute(v.route,v.fileName)
        })
        this.app.listen(3000, () => {
            console.log("Server Started");
        })
    }

    genericRoute(endpoint, fileName){
        this.app.get(endpoint,(req,res) => {
            const src = fs.createReadStream(this.baseDir + fileName);
            src.pipe(res);
        });
    }
}

const apiIns = new Api();

module.exports = apiIns;