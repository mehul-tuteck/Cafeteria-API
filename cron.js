const cron = require("node-cron");

cron.schedule("0 35 12 * * *", async ()=>{
    console.log("Helloooo")
})