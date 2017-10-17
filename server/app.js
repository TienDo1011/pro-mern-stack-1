import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();
import 'babel-polyfill';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
// import renderedPageRouter from './renderedPageRouter.jsx';
import passport from 'passport';
import flash from 'connect-flash';
import './auth/passport-init';

import './models/db';
import auth from './routes/auth';
import api from './routes/api';

const app = express();
app.use(express.static(path.resolve(__dirname, './../static/')));
app.use(bodyParser.json());
app.use(
  session({ secret: 'h7e3f5s6', resave: false, saveUninitialized: true }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use('/', auth);
app.use('/api', api);

app.get('/*', (req, res) => {
  res.sendFile('/index.html');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

export default app;
