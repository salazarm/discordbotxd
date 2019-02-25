const DiscordDriver = require('./api/dashboard/DiscordDriver.js');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const dashboardRouter = require('./routes/dashboard');
const signinRouter = require('./routes/signin');
const jobRouter = require('./routes/job');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

signinRouter(app);
dashboardRouter(app);
jobRouter(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

app.set('trust proxy', 1);
app.use(session({
  secret: 'y0u w1ll l0s3xDxddx',
  name: 'sessionId',
  resave: false,
}));

(async function() {
  await DiscordDriver.init(app);
})();

module.exports = app;
