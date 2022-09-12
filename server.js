const express = require('express');
const app = express();
const router = express.Router();
const bp = require('body-parser');
const webPush = require('web-push');

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log("You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY "+
    "environment variables. You can use the following ones:");
  console.log(webPush.generateVAPIDKeys());
  return;
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  'https://serviceworke.rs/',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

router.get('/vapidPublicKey', function(req, res) {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

router.post('/register', function(req, res) {
  // A real world application would store the subscription info.
  console.log("Registered a push request!");
  res.sendStatus(201);
});

router.post('/sendNotification', function(req, res) {
  console.log("Send notification request:", req.body);
  const subscription = req.body.subscription;
  const payload = null;
  const options = {
    TTL: req.body.ttl
  };

  setTimeout(function() {
    console.log("Sending notification!");
    webPush.sendNotification(subscription, payload, options)
    .then(function() {
      res.sendStatus(201);
    })
    .catch(function(error) {
      res.sendStatus(500);
      console.log(error);
    });
  }, req.body.delay * 1000);
});

const port = process.env.port || 3000;

app.use('/', router);
app.use(express.static('public'))

app.listen(port);

console.log('Web Server is listening at port '+ port);