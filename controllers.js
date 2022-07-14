const User = require('./User');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  const userExists = await User.findOne({
    phoneNumber,
  });

  if (!userExists) {
    return res.status(404).send({
      message: 'Please enter your phone number correctly',
      emoji: '(ง’̀-‘́)ง',
    });
  }
  const userDetails = await User.findOne({
    phoneNumber,
    password,
  });

  if (!userDetails) {
    return res.status(400).send({
      message:
        'The password or phone number you entered was incorrect, please check your details',
      emoji: 'ʕ •ᴥ•ʔ',
    });
  }

  const token = jwt.sign(
    userDetails.phoneNumber,
    userDetails.password,
    'tuteck-caf',
    { expiresIn: '400d' }
  );

  return res.status(200).send({
    message: 'Successfully logged in',
    emoji: '(✿◠‿◠)',
    token,
  });
};

const verify = async (req, res, next) => {
  const phoneNumber = req.phoneNumber;
  let response;

  try {
    const updateUser = await User.findOne({ phoneNumber });
    if (!updateUser.coffeeCup_1) {
      response = await User.updateOne({ phoneNumber }, { coffeeCup_1: true });
      return res.status(200).send({
        message: 'Thanks for ordering your first cup for the day',
        emoji: '(ᵔᴥᵔ)',
        response,
      });
    } else if (!updateUser.coffeeCup_2) {
      response = await User.updateOne({ phoneNumber }, { coffeeCup_2: true });
      return res.status(200).send({
        message: 'Thanks for ordering your second cup for the day',
        emoji: '(ᵔᴥᵔ)',
        response,
      });
    } else {
      return res.status(200).send({
        message: "It's get-your-wallet-out time",
        emoji: '(ᵔᴥᵔ)',
      });
    }
  } catch (error) {
    return res.status(400).send({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

module.exports = {
  login,
  verify,
};
