const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const connectDB = require("./config/db")

const app = express();


dotenv.config();



app.get("/", (req, res) =>{
    res.send({msg: "SkillServe API is Running"});
});

//Connect DBm
connectDB();

app.listen(process.env.PORT, () =>{
    console.log(`Server is Running at Port ${process.env.PORT}`);
});

