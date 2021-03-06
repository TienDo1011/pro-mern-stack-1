import _ from 'lodash';
import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
import { getIssues, addIssue, getIssue, updateIssue, deleteIssue } from '../controllers/issues';

router.all('/*', (req, res, next) => {
  if (req.method === 'DELETE' || req.method === 'POST' || req.method === 'PUT') {
    if (!req.isAuthenticated()) {
      res.status(403).json({
        message: 'You are not authrized to perform the operation',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.get('/issues', getIssues);

router.post('/issues', addIssue);

router.get('/issues/:id', getIssue);

router.put('/issues/:id', updateIssue);

router.delete('/issues/:id', deleteIssue);


router.get('/users/me', (req, res) => {
  if (_.get(req, 'session.passport.user')) {
    res.json(req.session.passport.user);
  } else {
    res.json({ signedIn: false, name: '' });
  }
});

export default router;
