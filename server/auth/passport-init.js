import _ from 'lodash';
import passport from 'passport';
import Strategy from 'passport-json';
import { OAuth2Strategy } from 'passport-google-oauth';
import users from './users.json';

import config from '../config';

passport.use(
  new Strategy((username, password, done) => {
    const user = _.find(users, { user: username, password });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  }),
);

passport.use(
  new OAuth2Strategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
