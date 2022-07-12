const { sequelize, Sequelize } = require("sequelize");
const db = require("./dbSetup");

const Users = require("./users")(db.sequelize, Sequelize);

const login = async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  const userExists = await Users.findOne({
    where: { phone_number: phoneNumber },
  });

  if (!userExists) {
    return res
      .status(404)
      .send("Please enter your phone number correctly (ง’̀-‘́)ง");
  }

  const userDetails = await Users.findOne({
    where: { phone_number: phoneNumber, password },
  });

  if (!userDetails) {
    return res.status(400).send({
      message:
        "The password or phone number you entered was incorrect, please check your details",
      emoji: "ʕ •ᴥ•ʔ",
    });
  }

  if (!userDetails.first_cup) {
    return res.status(200).send({
      message: `Hi ${userDetails.first_name}, would you like to have your first cup of coffee?`,
      emoji: "(✿◠‿◠)",
    });
  }

  if (!userDetails.second_cup) {
    return res.status(200).send({
      message: `Welcome back, ${userDetails.first_name}, would you like to have your second cup for the day?`,
      emoji: "(｡◕‿◕｡)",
    });
  }

  return res.status(400).send({
    message: `Sorry ${userDetails.first_name}, you have had your two free cups for the day`,
    emoji: "(ಠ_ಠ)",
  });
};

const verify = async (req, res, next) => {
  const { phoneNumber } = req.body;

  const userDetails = await Users.findOne({
    where: { phone_number: phoneNumber },
  });

  if (!userDetails.first_cup) {
    const update = await userDetails.update(
      {
        first_cup: 1,
      },
      { where: { phone_number: phoneNumber } }
    );

    console.log(update);

    return res.status(200).send({
      message: "Thank you, enjoy your coffee!",
      emoji: "(=^ェ^=)",
    });
  } else if (!userDetails.second_cup) {
    const update = await userDetails.update(
      {
        second_cup: 1,
      },
      { where: { phone_number: phoneNumber } }
    );

    console.log(update);

    return res.status(200).send({
      message: "Thank you, enjoy your coffee!",
      emoji: "(=^ェ^=)",
    });
  } else {
    return res.status(400).send({
      message: "Its get-your-wallet-out time",
      emoji: "¯_(ツ)_/¯",
    });
  }
};

module.exports = {
  login,
  verify,
};
