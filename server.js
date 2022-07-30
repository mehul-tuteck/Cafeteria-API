require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authenticationRouter = require("./routes/authRoutes");

const resetDB = require("./utils/dbUpdateCron");
const emailToAritra = require("./utils/mailCron");
const pingToKeepAlive = require("./utils/pingCron");

const app = express();
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Ping to keep alive");
});

app.use("/", authenticationRouter);

const connectDB = () => {
mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB Connected`);
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
}
  connectDB();
  pingToKeepAlive();
  emailToAritra();
  resetDB();