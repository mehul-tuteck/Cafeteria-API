const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
  },
  coffeeCup_1: {
    type: Boolean,
  },
  coffeeCup_2: {
    type: Boolean,
  },
});

module.exports = mongoose.model('User', UserSchema);
