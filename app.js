const express = require('express');
const bodyParser = require('body-parser');


const port = process.env.PORT || 3000;
const app = express();
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

app.use('/slack/events', slackEvents.expressMiddleware())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  return{
    text: "Hi I am ASQ"
  }
});


// Starts server
app.listen(port, function() {
  console.log('Bot is listening on port ' + port)
});
