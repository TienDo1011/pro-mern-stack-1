import express from 'express';
import passport from 'passport';
import path from 'path';
const router = express.Router(); // eslint-disable-line new-cap

router.post('/signin', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

router.post('/signout', (req, res) => {
  req.logout();
  res.json({ message: 'Log out successfully' });
});

export default router;
