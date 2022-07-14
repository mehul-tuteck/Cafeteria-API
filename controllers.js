const User = require('./User');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({
    email,
  });

  if (!userExists) {
    return res.status(404).send({
      message: 'Please enter your email correctly',
      emoji: '(ง’̀-‘́)ง',
    });
  }
  const userDetails = await User.findOne({
    email,
    password,
  });

  if (!userDetails) {
    return res.status(400).send({
      message:
        'The password or email you entered was incorrect, please check your details',
      emoji: 'ʕ •ᴥ•ʔ',
    });
  }

  const token = jwt.sign({ email, password }, 'tuteck-caf', {
    expiresIn: '400d',
  });

  return res.status(200).send({
    message: 'Successfully logged in',
    emoji: '(✿◠‿◠)',
    token,
    name: userDetails.name,
  });
};

const verify = async (req, res, next) => {
  const email = req.email;
  let response;

  try {
    const updateUser = await User.findOne({ email });
    if (!updateUser.coffeeCup_1) {
      response = await User.updateOne({ email }, { coffeeCup_1: true });
      return res.status(200).send({
        message: `Thanks ${updateUser.name} for ordering your first cup for the day`,
        emoji: '(ᵔᴥᵔ)',
        response,
      });
    } else if (!updateUser.coffeeCup_2) {
      response = await User.updateOne({ email }, { coffeeCup_2: true });
      return res.status(200).send({
        message: `Thanks ${updateUser.name} for ordering your second cup for the day`,
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
