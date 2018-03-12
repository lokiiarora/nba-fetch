const fs = require("fs");
const _ = require("lodash");
const fileConfig = require("./config");

class Sync {
  constructor() {
      this.fileConfig = fileConfig();
  }

  async syncAll() {
    await this.syncBeforeDailyTasks();
    await this.syncBeforeFrequentTasks();
    await this.syncBeforeOneTimeTasks();
  }

  async syncBeforeOneTimeTasks() {
    await this.oneTimeMaster();
  }

  async syncBeforeDailyTasks() {
    await this.dailyMaster();
  }

  async syncBeforeFrequentTasks() {
    await this.scoreBoardSync();
  }

  async scoreBoardSync() {
    const interimDir = __dirname + "/../data/archive/frequent/",
      dirname = interimDir + Date.now().toString(),
      actualLoc = __dirname + "/../data/scoreboard.json";
    this.frequentDir = dirname;
    const exists = fs.existsSync(interimDir);
    if (!exists) {
      fs.mkdirSync(interimDir);
    }
    fs.mkdirSync(dirname);
    const fileExist = fs.existsSync(actualLoc);
    if (fileExist) {
        await new Promise((resolve, reject) => {
            fs
              .createReadStream(actualLoc)
              .pipe(fs.createWriteStream(dirname + "/scoreboard.json"))
              .on("finish", () => resolve())
              .on("error", err => reject(err));
          });
    }
  }

  async dailyMaster() {
    const interimDir = __dirname + "/../data/archive/daily/",
      dirname = interimDir + Date.now().toString();
    this.dailyDir = dirname;
    const exists = fs.existsSync(interimDir);
    if (!exists) {
      fs.mkdirSync(interimDir);
    }
    fs.mkdirSync(dirname);
    await this.dailyBasing(this.fileConfig.daily);
  }

  async dailyBasing(config) {
    _.map(config, async val => {
        const actualLoc = __dirname + "/../data/" + val , exists = fs.existsSync(actualLoc);
        if(exists){
            await new Promise((resolve,reject) => {
                fs
                  .createReadStream(actualLoc)
                  .pipe(fs.createWriteStream(this.dailyDir + val))
                  .on("finish", () => resolve())
                  .on("error", err => reject(err));
            });
        }
        return null;
    });
  }

  async oneTimeMaster() {
    const interimDir = __dirname + "/../data/archive/onetime/",
      dirname = interimDir + Date.now().toString();
    this.onetimeDir = dirname;
    const exists = fs.existsSync(interimDir);
    if (!exists) {
      fs.mkdirSync(interimDir);
    }
    fs.mkdirSync(dirname);
    await this.oneTimeBasing(this.fileConfig.oneTime);
  }

  async oneTimeBasing(config) {
    _.map(config, async val => {
        const actualLoc = __dirname + "/../data/" + val , exists = fs.existsSync(actualLoc);
        if(exists){
            await new Promise((resolve,reject) => {
                fs
                  .createReadStream(actualLoc)
                  .pipe(fs.createWriteStream(this.onetimeDir + val))
                  .on("finish", () => resolve())
                  .on("error", err => reject(err));
            })
        }
        return null;
    });
  }


}

const syncHandler = new Sync();

module.exports = syncHandler;
