require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const twilio = require("twilio");
const mongoose = require("mongoose");

const router = require("./routes");
const { transporter, mailOptions } = require("./mailConfig.js");

const client = new twilio(process.env.SID, process.env.TOKEN);

const app = express();
app.use(router);

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
    console.log(`Server started on port ${process.env.PORT}`);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

//Running a script everyday at 11 PM to clear the DB.
cron.schedule("* 0 23 * * *", async () => {
  try {
    const users = await Users.findAll();

    users.map(async (current) => {
      await Users.update(
        {
          first_cup: null,
          second_cup: null,
        },
        {
          where: { id: current.id },
        }
      );
    });
  } catch (error) {
    client.messages.create({
      body: `DB update failed with ${error.message}`,
      to: "+917980996735",
      from: process.env.FROM,
    });
  }
});

//Running another script everyday at 7:30 PM to send a mail to Aritra Da on weekdays.
cron.schedule("* 30 19 * * 1-5", async () => {
  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      client.messages.create({
        body: `Mailing failed to Aritra with ${error}`,
        to: "+917980996735",
        from: process.env.FROM,
      });
    }
  });
});
