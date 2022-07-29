require('dotenv').config();
const reader = require('xlsx');
const User = require('../models/User');
const mongoose = require('mongoose');

const file = reader.readFile('./test.xlsx');

let data = [];
const sheets = file.SheetNames;

for (let i = 0; i < sheets.length; i++) {
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);

  temp.forEach((current) => {
    data.push(current);
  });
}

console.log(data);

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected');
    console.log(`Server started on port ${process.env.PORT}`);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

const addToDB = async () => {
  const promises = data
    .filter((current) => {
      return current.__EMPTY_4 === 'Kolkata';
    })
    .map((current) => {
      return {
        name: current.__EMPTY_1,
        email: current.__EMPTY_2,
        password: 'tuteck-caf',
        coffee_Cup1: false,
        coffee_Cup2: false,
      };
    });
  const resolved = await Promise.all(promises);
  response = await User.insertMany(resolved);
};

addToDB();
// User.collection.drop();
