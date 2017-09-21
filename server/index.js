import express from 'express';
// import session from 'express-session';
import bodyParser from 'body-parser';
// import { ObjectId } from 'mongodb';
// import Issue from './issue.js';
// import renderedPageRouter from './renderedPageRouter.jsx';

import './models/db';
import index from './routes/index';
import api from './routes/api';

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());


app.use('/', index);
app.use('/api', api);
// app.use(session({ secret: 'h7e3f5s6', resave: false, saveUninitialized: true }));

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

// app.use('/', renderedPageRouter);
