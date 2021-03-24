const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const port = process.env.PORT || 3000;
const app = express();

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const  { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_BOT_TOKEN;
const webClient = new WebClient(token);

app.use('/slack/events', slackEvents.expressMiddleware())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const projectId = process.env.projectId;

async function runSample(projectId) {

}

slackEvents.on('message', async (event) => {
  // console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  console.log(event);
  if(event.bot_id == undefined){

    // const res = await webClient.chat.postMessage({text:event.text ,channel: event.channel});
    // console.log('Message sent: ', res);
    // A unique identifier for the given session
    const sessionId = uuid.v4();

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: event.text,
          // The language used by the client (en-US)
          languageCode: 'en-US',
        },
      },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
  }


});


// Starts server
app.listen(port, function() {
  console.log('Bot is listening on port ' + port);
});
