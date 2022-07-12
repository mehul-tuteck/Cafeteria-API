const Users = require("./users");

const login = async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  const userExists = await Users.findOne({
    where: { phone_number: phoneNumber },
  });

  if (!userExists) {
    return res.status(404).send("User not found");
  }

  const userDetails = await Users.findOne({
    where: { phone_number: phoneNumber, password },
  });

  if (!userDetails) {
    return res.status(400).send("Password is incorrect");
  }

  return res.status(200).send("Logged in successfully");
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

    return res.status(200).send("1ta baaki");
  } else if (!userDetails.second_cup) {
    const update = await userDetails.update({
      second_cup: 1,
      where: { phone_number: phoneNumber },
    });

    console.log(update);

    return res.status(200).send("ses");
  } else {
    return res.status(400).send("Onek hoyeche, kine khao");
  }
};

module.exports = {
  login,
  verify,
};
