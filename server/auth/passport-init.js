import passport from 'passport';
import Strategy from 'passport-json';
import bcrypt from 'bcrypt';
import { OAuth2Strategy } from 'passport-google-oauth';
import User from '../models/User';

import config from '../config';

passport.use(
  new Strategy(async (username, password, done) => {
    const user = await User.findOne({ username });
    const res = await bcrypt.compare(password, user.password);
    if (!res) {
      return done(null, false);
    }
    return done(null, { username, password });
  }),
);

passport.use(
  new OAuth2Strategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile),
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
