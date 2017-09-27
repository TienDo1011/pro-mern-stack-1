import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap

router.post('/signin', async function(req, res) {
  if (!req.body.id_token) {
    res.status(400).send({ code: 400, message: 'Missing Token.' });
    return;
  }
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.id_token}`);
  // if (!response.ok) response.json().then(error => Promise.reject(error));
  if (response.ok) {
    console.log(response.json())
  }
  // .then(response => {
  //   response.json().then(data => {
  //     req.session.user = {
  //       signedIn: true, name: data.given_name,
  //     };
  //     res.json(req.session.user);
  //   });
  // })
  // .catch(error => {
  //   console.log(error);
  //   res.status(500).json({ message: `Internal Server Error: ${error}` });
  // });
});

router.post('/signout', (req, res) => {
  if (req.session) req.session.destroy();
  res.json({ status: 'ok' });
});

export default router;
