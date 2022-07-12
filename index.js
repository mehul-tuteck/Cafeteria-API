const fs = require("fs");

const results = fs.readFileSync("./Cafeteria.xlsx");
fs.writeFileSync("output.txt",results)

console.log(results);
