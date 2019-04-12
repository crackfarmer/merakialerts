# Description
This nodejs app takes incoming Meraki Alert webhooks, and sends the alert information to either Slack, Microsoft Teams, or Telegram.

# Running
```
git clone https://github.com/crackfarmer/merakialerts
cd merakialerts
npm install

Meraki_Secret=123456789 \
Slack_URL=https://hooks.slack.com/services/xxxxxxxxx \
Teams_URL=https://outlook.office.com/webhook/xxxxxxxxx \
Telegram_API_Key=xxxxxxxxx:xxxxxxxxx \
Telegram_Channel_ID=123456789 \
npm start
```
By default the  app listens for connections on port 3000. You can set a 'PORT=80' to the npm start string if needed, however I highly suggest using a reverse proxy like nginx or Caddy to enable HTTPS.

Meraki_Secret is mandatory. \
Must set at least one service to use. All can be used at the same time.

In Meraki dashboard need to setup a webhook for https://your.reverse.proxy

# Setup Services
+ In Slack channel setup a webhook,  use that URL for Slack_URL
+ In Microsoft Teams channel setup a webhook,  use that URL for Teams_URL
+ In Telegram, create a bot, join bot to channel, get channel ID. Use API key of bot for Telegram_API_Key, and channel ID for Telegram_Channel_ID.   [Check Telegram Docs](https://core.telegram.org/bots)

# Docker Container
[Docker Hub](https://hub.docker.com/r/crackfarmer/merakialerts)
