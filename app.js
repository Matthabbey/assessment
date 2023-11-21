const createError = require('http-errors');
const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectMongoDB = require("./config/index");
const router = require('./route')


var app = express();

dotenv.config();
connectMongoDB();



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use('/api', router)



const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
