const fs = require("fs");
const request = require("request-promise-native");
const _ = require("lodash");
const utilFuncHandler = require("./utilFunc");
const syncHandler = require("./sync");

class CronTasks {
  constructor() {
    this.dirname = __dirname;
  }

  async batchAllTasks() {
    const start = Date.now();
    await this.batchAllOneTimeTasks();
    await this.batchAllDailyTasks();
    await this.batchFrequentTasks();
    console.log("Batching all done!");
    console.log(`Time Taken ${(Date.now() - start).toString()}`);
  }

  async batchAllOneTimeTasks() {
    const start = Date.now();
    await syncHandler
      .syncBeforeOneTimeTasks()
      .then(() => console.log("One Time Sync Over!"));
    await this.fetchPlayerData();
    console.log("one time tasks done!", `\n Time Taken ${(Date.now() - start).toString()}`);
  }

  async batchAllDailyTasks() {
    const start = Date.now();
    await syncHandler
      .syncBeforeDailyTasks()
      .then(() => console.log("Daily Sync over!"));
    await this.fetchTodayData();
    await this.fetchShowCaseData();
    await this.fetchStandingsData();
    await this.fetchPlayerLineUpData();
    console.log("Batching daily done!", `\n Time Taken ${(Date.now() - start).toString()}`)
  }

  async batchFrequentTasks() {
    let start = Date.now();
    await syncHandler
      .syncBeforeFrequentTasks()
      .then(() => console.log("Frequent sync over"));
    await this.fetchScoreBoardData();
    console.log("Batching frequent done!", `\n Time Taken ${(Date.now() - start).toString()}`)
  }

  async fetchPlayerData() {
    const activePlayers = await request(
      "http://www.nba.com/players/active_players.json"
    );
    await new Promise((resolve, reject) => {
      fs.writeFile(
        this.dirname + "/../data/active_players.json",
        activePlayers,
        err => {
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    });
    const players = await request(
      "http://data.nba.net/prod/v1/2017/players.json"
    );
    await new Promise((resolve, reject) => {
      fs.writeFile(this.dirname + "/../data/players.json", players, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    const playerDataFinal = await utilFuncHandler.processPlayerData(
      JSON.parse(activePlayers),
      JSON.parse(players).league.standard
    );
    await this.writePlayerData(playerDataFinal);
  }

  async writePlayerData(fileVal) {
    fs.writeFileSync(
      this.dirname + "/../data/playerFinal.json",
      JSON.stringify(_.compact(fileVal)),
      {
        encoding: "UTF-8"
      }
    );
  }

  async fetchTodayData() {
    await request("https://data.nba.net/10s/prod/v3/today.json").pipe(
      fs.createWriteStream(this.dirname + "/../data/today.json")
    );
  }

  async fetchShowCaseData() {
    await request("http://stats.nba.com/js/data/widgets/home_daily.json").then(
      res => {
        this.writeAndProcessShowCaseData(JSON.parse(res));
      }
    );
  }

  async writeAndProcessShowCaseData(fileVal) {
    await utilFuncHandler.processShowCaseData(fileVal).then(res => {
      fs.writeFileSync(
        this.dirname + "/../data/home_daily.json",
        JSON.stringify(res),
        {
          encoding: "UTF-8"
        }
      );
    });
  }
  async fetchStandingsData() {
    await this.fetchConfStandData();
    await this.fetchDivisionData();
  }

  async fetchConfStandData() {
    await request(
      "https://data.nba.net/prod/v1/current/standings_conference.json"
    ).then(res => {
      this.writeAndProcessStandingsData(JSON.parse(res), true);
    });
  }

  async fetchDivisionData() {
    await request(
      "https://data.nba.net/prod/v1/current/standings_division.json"
    ).then(res => {
      this.writeAndProcessStandingsData(JSON.parse(res), false);
    });
  }

  async writeAndProcessStandingsData(fileVal, isConfData) {
    await utilFuncHandler.processStandingsData(fileVal).then(res => {
      fs.writeFileSync(
        this.dirname +
          "/../data/" +
          (isConfData ? "standingsConf.json" : "standingsDivision.json"),
        JSON.stringify(res),
        { encoding: "UTF-8" }
      );
    });
  }

  async fetchPlayerLineUpData() {
    await request(
      "http://stats.nba.com/js/data/widgets/players_landing_inner.json"
    ).then(res => {
      this.writeAndProcessLineUpData(JSON.parse(res));
    });
  }

  async writeAndProcessLineUpData(fileVal) {
    await utilFuncHandler.processLineUpData(fileVal).then(res => {
      fs.writeFileSync(
        this.dirname + "/../data/playersLanding.json",
        JSON.stringify(res),
        { encoding: "UTF-8" }
      );
    });
  }

  async fetchScoreBoardData() {
    await request("https://data.nba.net/prod/v2/20180310/scoreboard.json").then(
      res => {
        this.writeAndProcessScoreBoardData(JSON.parse(res));
      }
    );
  }

  async writeAndProcessScoreBoardData(fileVal) {
    await utilFuncHandler.processScoreBoardData(fileVal).then(res => {
      fs.writeFileSync(
        this.dirname + "/../data/scoreboard.json",
        JSON.stringify(res),
        { encoding: "UTF-8" }
      );
    });
  }
}

const ins = new CronTasks();

module.exports = ins;
