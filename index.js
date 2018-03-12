const process = require("process");
const cronJob = require("./utils/cron");
const apiIns = require("./api");
const cronTasks = require("./utils/cronTasks");
const utilHandler = require("./utils/utilFunc");

const init = async () => {
    console.log("initiation");
    await utilHandler.initApp(__dirname + "/data/");
    await cronTasks.batchAllTasks();
    apiIns.initRoutes();
    console.log("Before cron jobs start")
    cronJob.dailyJob.start();
    cronJob.frequentJob.start();
    cronTasks.batchAllOneTimeTasks().then(_ => null);
    cronJob.cleanupJob.start();
}
init().then(() => console.log("everything init"));
