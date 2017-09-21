import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
// import { dict, suggestion } from '../controllers/main';

/* GET home page. */
// router.get("/", (req, res, next) => {
//   res.render("index", { title: "Tieng anh thay Tien" });
// });

// router.get("/dict", dict);
// router.get("/q", suggestion);

router.post('/signin', (req, res) => {
  if (!req.body.id_token) {
    res.status(400).send({ code: 400, message: 'Missing Token.' });
    return;
  }
  fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.id_token}`)
  .then(response => {
    if (!response.ok) response.json().then(error => Promise.reject(error));
    response.json().then(data => {
      req.session.user = {
        signedIn: true, name: data.given_name,
      };
      res.json(req.session.user);
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
});

router.post('/signout', (req, res) => {
  if (req.session) req.session.destroy();
  res.json({ status: 'ok' });
});

export default router;
