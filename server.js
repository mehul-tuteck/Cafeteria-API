require("dotenv").config();
const express = require("express");
const cors = require("cors");


const router = require("./routes");

const app = express();

app.use(cors())
app.use(router);

app.use(process.env.PORT ,(req,res,next)=>{
    console.log("Database connected")
    console.log(`Server started on port ${process.env.PORT}`)
})




