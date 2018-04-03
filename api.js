const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const _ = require("lodash");
const morgan = require("morgan");
const path = require("path");
const routeMap = require("./utils/apiConfig");
const process = require("process");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

class Api {
  constructor() {
    this.app = express();
    this.baseDir = __dirname + "/data/";
    this.port = process.env.PORT || 3000;
  }

  initRoutes() {
    this.app.use(morgan(":method :url :status :response-time ms"));
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    this.app.get("*.js", function(req, res, next) {
      req.url = req.url + ".gz";
      res.set("Content-Encoding", "gzip");
      next();
    });
    this.app.use(express.static(path.join(__dirname, "build")));
    this.app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
    });
    this.app.get("/health", (req, res) => {
      res.json({
        body: "Running all fine tbh"
      });
    });
    _.map(routeMap(), v => {
      this.genericRoute(v.route, v.fileName);
    });
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.app.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "./build/index.html"));
    });
    this.app.listen(this.port, () => {
      console.log(`Server Started at ${this.port}`);
    });
  }

  genericRoute(endpoint, fileName) {
    this.app.get(endpoint, (req, res) => {
      const src = JSON.parse(
        fs.readFileSync(this.baseDir + fileName, {
          encoding: "UTF-8"
        })
      );
      res.status(200);
      res.json(src);
    });
  }
}

const apiIns = new Api();

module.exports = apiIns;
