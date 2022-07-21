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
app.use(express.json());

app.use('/', coffeeRoutes);

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
cron.schedule('* 10 11 * * *', async () => {

  const users = await User.find();

  try {
    users.map(async (currentUser)=>{
      await currentUser.update({
        coffeeCup_1 : false,
        coffeeCup_2 : false
      })
    })
  } catch (error) {
    console.log(error.message);
    client.messages.create({
      body: `DB update failed with ${error} ${error.message} `,
      to: '+917980996735',
      from,
    });
    process.exit(1);
  }
});

// //Running another script everyday at 7:30 PM to send a mail to Aritra Da on weekdays.
// cron.schedule('* 30 19 * * 1-5', async () => {
//   transporter.sendMail(mailOptions, (error, response) => {
//     if (error) {
//       client.messages.create({
//         body: `Mailing failed to Aritra with ${error} ${error.message}`,
//         to: '+917980996735',
//         from,
//       });
//       process.exit(1);
//     }
//   });
// });
