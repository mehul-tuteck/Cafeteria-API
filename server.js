require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const twilio = require("twilio");
const mongoose = require("mongoose");
const coffeeRoutes = require("./routes");
const User = require("./User");
const transporter = require("./transporter");
const axios = require("axios");
const moment = require("moment");

const { generateWorkSheet } = require("./excel");

const sid = process.env.SID;
const token = process.env.TOKEN;
const from = process.env.FROM;

const client = require("twilio")(sid, token);

const app = express();
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Ping to keep alive");
});
app.use("/", coffeeRoutes);

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB Connected`);
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

//Running a script everyday at 11 PM to clear the DB.
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

cron.schedule("0 */20 * * * *", async () => {
  const response = await axios.get("https://tuteck-caf.herokuapp.com/");
  console.log(response.data);
});

//Running another script everyday at 7:30 PM to send a mail to Aritra Da on weekdays.
cron.schedule("0 30 19 * * 1-5", async () => {
  generateWorkSheet();
  var mailOptions = {
    from: "ctanmoy345@gmail.com",
    to: "mehulchattopadhyay2015@gmail.com",
    subject: "Coffee details for today",
    content:
      "Please find the excel sheet for the coffee details of employees for today",
    attachments: [
      {
        filename: `${moment(Date.now()).format("MMM Do YY")}.xlsx`,
        path: `./${moment(Date.now()).format("MMM Do YY")}.xlsx`,
      },
    ],
  };
  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      console.log(error.message);
      client.messages.create({
        body: `Mailing failed to Aritra ${error} ${error.message} `,
        to: "+917980996735",
        from,
      });
      process.exit(1);
    } else {
      client.messages.create({
        body: `Mail sent to Aritra`,
        to: "+917980996735",
        from,
      });
    }

    fs.unlinkSync(`${moment(Date.now()).format("MMM Do YY")}.xlsx`);
  });
});
