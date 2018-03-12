const cronJob = require("cron").CronJob;
const cronTasks = require("./cronTasks");
const utilHandler = require("./utilFunc");

const dailyJob = new cronJob('0 0 */23 * * *', () => {
    cronTasks.batchAllDailyTasks();
},() => {
    // Run cleanup tasks
    console.log("Daily task done!");
},true,null,null,true);

const frequentJob = new cronJob('0 */5 * * * *', () => {
    cronTasks.batchFrequentTasks();
},() => {
    console.log("Frequent cron done!");
},true,null,null,true);

const cleanupJob = new cronJob('1 * * * * *', () => {
    utilHandler.cleanUp(__dirname + "/../data/archive/");
}, () => {
    console.log("Clean up done");
});

module.exports = {
    dailyJob,
    frequentJob,
    cleanupJob
};
