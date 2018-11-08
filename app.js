var watson = require('watson-developer-cloud');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./public'));

const port = 8080;
//El personal::::::::::::::
// const assistant = new watson.AssistantV1({
//   // username: 'cb20956e-e953-467b-819f-1839b53ee83e',
//   username: '808ce296-a6c7-4ff2-9381-72b4c4e6c540',
//   // password: 'VTclYHjHSBbw',
//   password: '773bvsYaXGtD',
//   url: 'https://gateway.watsonplatform.net/assistant/api/',
//   version: '2018-09-20'
// });
//El de trabajo::::::::::::::::.
const assistant = new watson.AssistantV1({
  // username: 'cb20956e-e953-467b-819f-1839b53ee83e',
  username: 'cb20956e-e953-467b-819f-1839b53ee83e',
  // password: 'VTclYHjHSBbw',
  password: 'VTclYHjHSBbw',
  url: 'https://gateway.watsonplatform.net/assistant/api/',
  version: '2018-09-20'
});

// var workspace_ide = 'b8c5da2a-26dd-4477-a58b-87b58fe6a75f'; // replace with workspace ID
// var workspace_ide = '12c82c91-c83b-450c-b7ba-d649eb1bbf0a'; personal// replace with workspace ID
var workspace_ide = 'b8c5da2a-26dd-4477-a58b-87b58fe6a75f';// el de trabajo

app.post('/conversation/', (req, res) => {
  const { text, context = {} } = req.body;

  const params = {
    input: { text },
    workspace_id: workspace_ide,
    context,
  };

  assistant.message(params, (err, response) => {
    if (err) res.status(500).json(err);

    res.json(response);
  });
});

app.listen(port, () => console.log(`Running on port ${port}`));
