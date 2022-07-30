const cron = require("node-cron");

const ping = () => {
  cron.schedule("0 */05 * * * *", async () => {
    const response = await axios.get("https://tuteck-caf.herokuapp.com/");
    console.log(response.data);
  });
};

module.exports = ping;
