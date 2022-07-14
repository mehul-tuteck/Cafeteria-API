require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const twilio = require('twilio');
const mongoose = require('mongoose');
const coffeeRoutes = require('./routes');
const User = require('./User');
const { transporter, mailOptions } = require('./mailConfig.js');

const sid = process.env.SID;
const token = process.env.TOKEN;
const from = process.env.FROM;

const client = require('twilio')(sid, token);

const app = express();
app.use('/', coffeeRoutes);

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected');
    console.log(`Server started on port ${process.env.PORT}`);

  //   //Running a script everyday at 11 PM to clear the DB.
  //   cron.schedule('* 0 23 * * *', async () => {
  //     let condition = {};
  //     let update = {
  //       $set: {
  //         coffee_Cup1: false,
  //         coffee_Cup2: false,
  //       },
  //     };
  //     let options = { multi: true };

  //     try {
  //       await User.updateMany(condition, update, options);
  //     } catch (error) {
  //       console.log(error.message);
  //       client.messages.create({
  //         body: `DB update failed with ${error} ${error.message} `,
  //         to: '+917980996735',
  //         from,
  //       });
  //     }
  //   });

  //   //Running another script everyday at 7:30 PM to send a mail to Aritra Da on weekdays.
  //   cron.schedule('* 30 19 * * 1-5', async () => {
  //     transporter.sendMail(mailOptions, (error, response) => {
  //       if (error) {
  //         client.messages.create({
  //           body: `Mailing failed to Aritra with ${error} ${error.message}`,
  //           to: '+917980996735',
  //           from,
  //         });
  //       }
  //     });
  //   });
  // })
  // .catch((error) => {
  //   console.log(error);
  //   process.exit(1);
  // });
