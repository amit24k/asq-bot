const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const app = express();
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Starts server
// app.listen(port, function() {
//   console.log('Bot is listening on port ' + port)
// });
slackEvents.start(port).then(() => {
  // Listening on path '/slack/events' by default
  console.log(`server listening on port ${port}`);
});
