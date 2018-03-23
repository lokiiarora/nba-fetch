const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const _ = require("lodash");
const morgan = require("morgan");
const routeMap = require("./utils/apiConfig");
const process = require("process");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

class Api {
    constructor() {
        this.app = express();
        this.baseDir = __dirname + "/data/";
        this.port = process.env.PORT || 80;
    }

    initRoutes() {
        this.app.use(morgan(":method :url :status :response-time ms"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use((req,res,next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        })
        this.app.get("/", (req,res) => {
            res.json({
                body: "Running all fine tbh"
            });
        });
        _.map(routeMap(), v => {
            this.genericRoute(v.route,v.fileName)
        });
        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
        this.app.listen(this.port, () => {
            console.log(`Server Started at ${this.port}`);
        })
    }

    genericRoute(endpoint, fileName){
        this.app.get(endpoint,(req,res) => {
            const src = fs.createReadStream(this.baseDir + fileName);
            res.status(200);
            src.pipe(res);
        });
    }
}

const apiIns = new Api();

module.exports = apiIns;