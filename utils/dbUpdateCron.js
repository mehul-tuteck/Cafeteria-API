const cron = require("node-cron");

const User = require("../models/User");
const client = require("../config/twilioConfig");

//Running a script everyday at 11 PM to clear the DB.
const resetDB = () => {
  cron.schedule("0 0 23 * * *", async () => {
    const users = await User.find();
    console.log(users);
    try {
      users.map(async (currentUser) => {
        await currentUser.update({
          coffeeCup_1: false,
          coffeeCup_2: false,
        });
      });
      client.messages.create({
        body: `DB update Finished `,
        to: "+917980996735",
        from,
      });
    } catch (error) {
      console.log(error.message);
      client.messages.create({
        body: `DB update failed with ${error} ${error.message} `,
        to: "+917980996735",
        from,
      });
      process.exit(1);
    }
  });
};

module.exports = resetDB;
