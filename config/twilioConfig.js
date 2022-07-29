const sid = process.env.SID;
const token = process.env.TOKEN;
const from = process.env.FROM;

const client = require("twilio")(sid, token);

module.exports = client;
