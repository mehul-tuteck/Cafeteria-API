require("dotenv").config();
const cron = require("node-cron");

const User = require("../models/User");
const client = require("../config/twilioConfig");

const from = process.env.FROM;

//Running a script everyday at 11 PM to clear the DB.
const resetDB = async () => {
  cron.schedule("0 24 0 * * *", async () => {
    const usersBeforeUpdate = await User.find();
    console.log({ usersBeforeUpdate });
    try {
      usersBeforeUpdate.map(async (currentUser) => {
        await currentUser.update({
          coffeeCup_1: false,
          coffeeCup_2: false,
        });
      });
      const usersAfterUpdate = await User.find();
      console.log({ usersAfterUpdate });
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
