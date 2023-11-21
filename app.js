const express = require('express');
const dotenv = require("dotenv");
const connectMongoDB = require("./config/index");
const router = require('./route')


var app = express();

dotenv.config();
connectMongoDB();


app.use('/api', router)



const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
