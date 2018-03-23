const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const cronTasks = require("./cronTasks");

class UtilFunc {
  constructor() {}

  async initApp(baseDir) {
    console.log("Starting the app");
    if(!fs.existsSync(baseDir)){
      fs.mkdirSync(baseDir);
      console.log("made base dir");
      fs.mkdirSync(baseDir+ "/archive/");
      console.log("made archive dir");
      fs.mkdirSync(baseDir+ "/archive/daily/");
      fs.mkdirSync(baseDir+ "/archive/frequent/");
      fs.mkdirSync(baseDir+ "/archive/onetime/");
    }
  }

  findPlayerIndex(personId, playerData) {
    return _.findIndex(playerData, o => o.personId === personId);
  }

  async processPlayerData(activePlayerData, totalPlayerData) {
    return await _.map(activePlayerData, val => {
      let newVal = val,
        id = this.findPlayerIndex(val.personId, totalPlayerData);
      if (id !== -1) {
        newVal["teamId"] = totalPlayerData[id].teamId;
        newVal["isActive"] = totalPlayerData[id].isActive;
        newVal["heightMeters"] = totalPlayerData[id].heightMeters;
        newVal["weightKilograms"] = totalPlayerData[id].weightKilograms;
        newVal["dateOfBirthUTC"] = totalPlayerData[id].dateOfBirthUTC;
        newVal["teams"] = totalPlayerData[id].teams;
        newVal["draft"] = totalPlayerData[id].draft;
        newVal["nbaDebutYear"] = totalPlayerData[id].nbaDebutYear;
        newVal["yearsPro"] = totalPlayerData[id].yearsPro;
        newVal["lastAffiliation"] = totalPlayerData[id].lastAffiliation;
        newVal["country"] = totalPlayerData[id].country;
        return newVal;
      }
      return null;
    });
  }


  async processShowCaseData(dataToBePicked) {
    const obj = {},
      { count, items } = dataToBePicked;
    obj["count"] = count;
    obj["items"] = items;
    return obj;
  }

  async processStandingsData(dataToBePicked) {
    const obj = {},
      {
        conference,
        seasonStageId,
        seasonYear
      } = dataToBePicked.league.standard;
    obj["data"] = conference;
    obj["stageID"] = seasonStageId;
    obj["seasonYear"] = seasonYear;
    return obj;
  }

  async processLineUpData(dataToBePicked) {
    const { items, count } = dataToBePicked;
    return {
      data: items,
      count
    };
  }

  async processScoreBoardData(dataToBePicked) {
    const { games, numGames } = dataToBePicked;
    return {
      data: games,
      count: numGames
    };
  }

  listAllDirs(baseDir) {
    return fs
      .readdirSync(baseDir)
      .filter(f => fs.statSync(path.resolve(baseDir, f)).isDirectory())
      .map(x => path.resolve(baseDir, x));
  }

  checkEmptyDir(dir) {
    return fs.readdirSync(dir).length === 0;
  }

  cleanUp(baseDir) {
    const pathMap = this.listAllDirs(baseDir);
    pathMap.map(x => {
      let innerPathMap = this.listAllDirs(x);
      innerPathMap.map(path => {
        if (this.checkEmptyDir(path)) {
          fs.rmdirSync(path);
        }
      });
    });
    console.log("Swaach Bharat");
  }
}

module.exports = new UtilFunc();
