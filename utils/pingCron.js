const cron = require("node-cron");
const axios = require("axios");

const ping = () => {
  cron.schedule("*/20 * * * *", async () => {
    const response = await axios.get("https://tuteck-caf.herokuapp.com/");
    console.log(response.data);
  });
};

module.exports = ping;
