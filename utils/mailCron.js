require("dotenv").config();
const cron = require("node-cron");
const moment = require("moment");
const fs = require("fs");

const User = require("../models/User");
const client = require("../config/twilioConfig");
const transporter = require("../config/mailConfigGmail");
const { generateWorkSheet } = require("../services/generateExcel");

const from = process.env.FROM;

//Running a script everyday at 7:30 PM to send a mail to Aritra Da on weekdays.
const sendEmail = async () => {
  try {
    cron.schedule("0 30 19 * * 1-5", async () => {
      await generateWorkSheet();
      var mailOptions = {
        from: "ctanmoy345@gmail.com",
        to: [
          "aritra.mitra@tuteck.com",
          "mehulchattopadhyay2015@gmail.com",
           "tanmoy.chandra@tuteck.com",
           "binayadak16@gmail.com"
        ],
        subject: "Coffee details for today",
        text: "Please find the excel sheet for the coffee details of employees for today",
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
          console.log("Mail sent");
          client.messages.create({
            body: `Mail sent to Aritra`,
            to: "+917980996735",
            from,
          });
        }

        fs.unlinkSync(`./${moment(Date.now()).format("MMM Do YY")}.xlsx`);
      });
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = sendEmail;
