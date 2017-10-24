import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/User';

const router = express.Router(); // eslint-disable-line new-cap
const SALTROUNDS = 10;

router.post('/signup', async (req, res) => {
  const userInfo = req.body;
  try {
    const hash = await bcrypt.hash(userInfo.password, SALTROUNDS);
    await User.create({
      username: userInfo.username,
      password: hash,
    });
    res.json({ message: 'User is created' });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err}` });
  }
});

router.post('/signin', passport.authenticate('json'), (req, res) => {
  res.json(req.user);
});

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login'],
  }),
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/');
  },
);

router.post('/signout', (req, res) => {
  req.logout();
  res.json({ message: 'Log out successfully' });
});

export default router;
