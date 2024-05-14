const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const PushNotifications = require("node-pushnotifications");
const cors = require('cors');
const app = express();
const fs = require('fs');

app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

app.use(cors());

const publicVapidKey = "BJTVbeluLDKkV12Oyd-LTf8Bxcq3iKKAz7rkUMFIqKyu-5uxt8_-PpK3DvuI1eDk_Dm-WC8I7IsYMHVeVJTWReY";
const privateVapidKey = ""//COLOQUE AQUI TUA CHAVE PRIVADA;
const emailVapidKey = "mailto://###############  ########## @gmail.com";//COLOQUE_O_TEU_EMAIL_AQUI

const allBrowsersSubscription = [];

let allSubscriptions = '';
try{
  allSubscriptions = fs.readFileSync(path.join(__dirname,'subscriptions.txt'),{ encoding: 'utf8', flag: 'r' });
} catch(e) {
  fs.writeFileSync(path.join(__dirname,'subscriptions.txt'),'');
}
if(allSubscriptions) {
  console.log('loading all subscriptions', allSubscriptions);
  let alltxt = allSubscriptions.split('\n');
  alltxt.forEach(a => allBrowsersSubscription.push(JSON.parse(a)));
}

/******************************* the endpoint /subscribe register the browser to listen push notifications from this server *********************************************/
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  console.log('subscription', subscription);
  if(allBrowsersSubscription.find(s => subscription.keys.p256dh == s.keys.p256dh)){
    console.log('subscription already exists');
    return;
  }
  allBrowsersSubscription.push(subscription);
  fs.appendFileSync(path.join(__dirname,'subscriptions.txt'), JSON.stringify(subscription)+'\n');
});
/******************************* the endpoint /subscribe register the browser to listen push notifications from this server *********************************************/



/******************************* the endpoint /sendNotification uses the PushNotifications library to send a push notification to the browsers listening *********************************************/
app.get("/sendNotification", (req, res) => {

  console.log('sending notification');
  console.log(allBrowsersSubscription.length);

  const settings = {
    web: {
      vapidDetails: {
        subject: emailVapidKey, 
        publicKey: publicVapidKey,
        privateKey: privateVapidKey,
      },
      gcmAPIKey: "gcmkey",
      TTL: 2419200,
      contentEncoding: "aes128gcm",
      headers: {},
    },
    isAlwaysUseFCM: false,
  };
  const push = new PushNotifications(settings);

  const notificationPayload = {
    "notification": {
        "title": "Nerd Store",
        "body": "Chegaram novos produtos!",
        "icon": "assets/icons/java.png",
        "vibrate": [100, 50, 100],
        "actions": [
          {"action": "check", "title": "Conferir os produtos"}, 
          {"action": "bestprice", "title": "Ver os melhores preços"}
        ],
        "data": {
          "dateOfArrival": Date.now(),
          "primaryKey": 1,
          "onActionClick": {
            "default": {"operation": "openWindow"},
            "check": {"operation": "navigateLastFocusedOrOpen", "url": "http://localhost:3000/discounted"},
            "bestprice": {"operation": "focusLastFocusedOrOpen", "url": "http://localhost:3000/bestprice"},
          }
        }
    }
  };

  allBrowsersSubscription.forEach(subscription => {
    push.send(subscription, JSON.stringify(notificationPayload) , (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  });

  res.send('Push notification sent to the browsers!');
});
/******************************* the endpoint /sendNotification uses the PushNotifications library to send a push notification to the browsers listening *********************************************/





/******************************* the endpoint /sendPushNotificationNewsletter uses the webpush library to send a push notification to the browsers listening *********************************************/
webpush.setVapidDetails(
    emailVapidKey,
    publicVapidKey,
    privateVapidKey
);

//app.route('/sendPushNotificationNewsletter').post(sendNewsletter);
app.route('/sendPushNotificationNewsletter').get(sendNewsletter);

function sendNewsletter(req, res) {

  console.log('sending newsletter');
  console.log(allBrowsersSubscription.length);

  const notificationPayload = {
    "notification": {
        "title": "Games play",
        "body": "Promoção PS5!",
        "icon": "assets/icons/games.png",
        "vibrate": [100, 50, 100],
        "data": {
          "onActionClick": {
            "default": {"operation": "openWindow"},
            "explore": {"operation": "openWindow", "url": "http://localhost:3000/newproduct"},
            "reserve": {"operation": "sendRequest", "url": "http://localhost:3000/reserve"}
          },
          "dateOfArrival": Date.now(),
          "primaryKey": 1
        },
        "actions": [
          {"action": "explore", "title": "Venha conferir!"},
          {"action": "reserve", "title": "Faça tua reserva!"}
        ]
    }
  };

  allBrowsersSubscription.forEach(subscription => {
    webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
        .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });
  });
}
/******************************* the endpoint /sendPushNotificationNewsletter uses the webpush library to send a push notification to the browsers listening *********************************************/



app.get("/discounted", (req, res) => {
  res.send('discounts page');
});

app.get("/newproduct", (req, res) => {
  res.send('new products page');
});

app.get("/bestprice", (req, res) => {
  res.send('best price page!');
});

app.get("/reserve", (req, res) => {
  res.send('make reserve page');
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));