const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  coffeeCup_1: {
    type: Boolean,
  },
  coffeeCup_2: {
    type: Boolean,
  },
});

module.exports = mongoose.model("User", UserSchema);
