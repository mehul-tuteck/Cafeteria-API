const mongoose = require("mongoose");
const fs = require("fs");
const moment = require("moment");
const xlsx = require("xlsx");
const User = require("./User");

let workbook = xlsx.utils.book_new();
const generateWorkSheet = async () => {
  const users = await User.find();
  const promises = users.map(async (currentUser) => {
    let both = false;
    let single = false;

    if (currentUser.coffeeCup_1 && currentUser.coffeeCup_2) {
      both = true;
    } else if (currentUser.coffeeCup_1 && !currentUser.coffeeCup_2) {
      single = true;
    }

    return {
      Name: currentUser.name,
      "Email-ID": currentUser.email,
      "Coffee Cup 1": currentUser.coffeeCup_1 ? "Yes" : "No",
      "Coffee Cup 2": currentUser.coffeeCup_2 ? "Yes" : "No",
      Total: both ? 2 : single ? 1 : 0,
    };
  });
  const resolved = await Promise.all(promises);
  const worksheet = xlsx.utils.json_to_sheet(resolved);
  xlsx.utils.book_append_sheet(
    workbook,
    worksheet,
    `${moment(Date.now()).format("MMM Do YY")}.xlsx`
  );
  xlsx.writeFile(workbook, `${moment(Date.now()).format("MMM Do YY")}.xlsx`);
};

module.exports = { generateWorkSheet };
