const Users = require('./users');
const reader = require('xlsx');

const readFile = () => {
  const file = reader.readFile('./Cafeteria.xlsx');
  let data = [];
  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      data.push(res);
    });
  }

  console.log(data);
};

const login = async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  const userExists = await Users.findOne({
    where: { phone_number: phoneNumber },
  });

  if (!userExists) {
    return res
      .status(404)
      .send('Please enter your phone number correctly (ง’̀-‘́)ง');
  }

  const userDetails = await Users.findOne({
    where: { phone_number: phoneNumber, password },
  });

  if (!userDetails) {
    return res
      .status(400)
      .send(
        'The password you entered was incorrect, please enter the correct password ʕ •ᴥ•ʔ'
      );
  }

  if (!userDetails.first_cup) {
    return res
      .status(200)
      .send(
        `Hi ${userDetails.first_name}, would you like to have your first cup for the day? (✿◠‿◠)`
      );
  }

  if (!userDetails.second_cup) {
    return res
      .status(200)
      .send(
        `Welcome back, ${userDetails.first_name}, would you like to have your second cup for the day? (｡◕‿◕｡)`
      );
  }

  return res
    .status(400)
    .send(
      `Sorry ${userDetails.first_name}, you have had your two free cups for the day (ಠ_ಠ)`
    );
};

const verify = async (req, res, next) => {
  const { phoneNumber } = req.body;

  const userDetails = await Users.findOne({
    where: { phone_number: phoneNumber },
  });

  if (!userDetails.first_cup) {
    const update = await userDetails.update({
      first_cup: 1,
      where: { phone_number: phoneNumber },
    });

    console.log(update);

    return res.status(200).send('1ta baaki');
  } else if (!userDetails.second_cup) {
    const update = await userDetails.update({
      second_cup: 1,
      where: { phone_number: phoneNumber },
    });

    console.log(update);

    return res.status(200).send('ses');
  } else {
    return res.status(400).send('Onek hoyeche, kine khao');
  }
};

module.exports = {
  login,
  verify,
};
