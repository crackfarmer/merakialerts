// 2/21/19
// crackfarmer@gmail.com

var express = require('express');
var router = express.Router();
const request = require('request');

// Assign Env Vars
const Meraki_Secret = process.env.Meraki_Secret;
const Slack_URL = process.env.Slack_URL;
const Teams_URL = process.env.Teams_URL;
const Telegram_API_Key = process.env.Telegram_API_Key;
const Telegram_Channel_ID = process.env.Telegram_Channel_ID;

// Check if Env Vars were set
if(!Meraki_Secret){
  console.log("Meraki_Secret not set, exiting.")
  process.exit();
}

// Check if Env Vars were set
if(!Slack_URL && !Teams_URL && !Telegram_API_Key){
  console.log("Slack_URL, Teams_URL, and Telegram_API_Key not set, exiting.")
  process.exit();
}

// Verify a telegram channel id is set if API key is set
if(Telegram_API_Key)
  if(!Telegram_Channel_ID){
    console.log("Telegram API Key is set, but Channel ID is not set, exiting.")
    process.exit();
  }

// GET for root
router.get('/', function(req, res, next) {
  // if a GET vs POST is received, send a blank page
  res.send('').end();
});

router.post('/', function(req, res, next) {
  //validate the POST came from Meraki. Also check if alert was generated using the "Send Test webhook" button
  if(req.body.sharedSecret == Meraki_Secret || (req.body.alertType == "Settings changed" && req.body.alertId == 0)){
    console.log(req.body);

    // Assign vars from JSON post
    var organizationName = req.body.organizationName;
    var networkName = req.body.networkName;
    var deviceName = req.body.deviceName;
    var alertType = req.body.alertType;
    var deviceUrl = req.body.deviceUrl;

    if(Slack_URL){
      // Build alert to send to Slack
      var alert = "Network: "+networkName+"\nAlert: "+alertType;

      // If alert was about a device, add that info.
      if(deviceName){
        alert = alert+"\nDevice: <"+deviceUrl+"|"+deviceName+">";
      }

      // Set HTTP POST options
      var options = {
        url: Slack_URL,
        json: { "text": alert}
      };

      // Do HTTP POST
      request.post(options,function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("Alert Sent to Slack.");
        }
        else{
          console.log("** Error sending to Slack **")
          console.log("URL Used for Slack: "+options.url);
          console.log("JSON sent to Slack: "+JSON.stringify(options.json));
          console.log("HTTP Response from Slack: "+JSON.stringify(response));
          console.log("Nodejs Error: "+error);
        }
      });
    }

    if(Teams_URL){
      // Build alert to send to Teams
      // Alerts Markdown
      var alert = "Network: "+networkName+"  \nAlert: "+alertType+"  ";

      // If alert was about a device, add that info.
      if(deviceName){
        alert = alert+"\nDevice: ["+deviceName+"]("+deviceUrl+")";
      }

      // Set HTTP POST options
      var options = {
        url: Teams_URL,
        json: { "@type": "MessageCard","@context": "https://schema.org/extensions","text": alert}
      };

      // Do HTTP POST
      request.post(options,function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("Alert Sent to MS Teams.");
        }
        else{
          console.log("** Error sending to MS Teams **")
          console.log("URL Used for MS Teams: "+options.url);
          console.log("JSON sent to MS Teams: "+JSON.stringify(options.json));
          console.log("HTTP Response from MS Teams: "+JSON.stringify(response));
          console.log("Nodejs Error: "+error);
        }
      });
    }

    if(Telegram_API_Key){
      // Build alert to send to Telegram
      // Alerts Markdown
      var alert = "Network: "+networkName+"  \nAlert: "+alertType+"  ";

      // If alert was about a device, add that info.
      if(deviceName){
        alert = alert+"\nDevice: ["+deviceName+"]("+deviceUrl+")";
      }

      // Set HTTP POST options
      var options = {
        url: "https://api.telegram.org/bot"+Telegram_API_Key+"/sendMessage",
        json: { "chat_id": Telegram_Channel_ID, "parse_mode": "Markdown", "disable_web_page_preview": true, "text": alert}
      };

      // Do HTTP POST
      request.post(options,function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("Alert Sent to Telegram.");
        }
        else{
          console.log("** Error sending to Telegram **")
          console.log("URL Used for Telegram: "+options.url);
          console.log("JSON sent to Telegram: "+JSON.stringify(options.json));
          console.log("HTTP Response from Telegram: "+JSON.stringify(response));
          console.log("Nodejs Error: "+error);
        }
      });
    }

    // Respond with HTTP 204 back to Meraki
    res.status(204).end();
  }
  else{
    // Respond with HTTP 204 back to random person posting to this URL
    res.status(204).end();
  }
});

module.exports = router;
