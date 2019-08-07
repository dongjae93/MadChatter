const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const BASE_URL = 'https://78bbe158.ngrok.io';
// const d = require('../../FEC/scraped/photo/1.jpg')
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const yoyos = require('./yoyos.json');

app.post("/yoyos", (req, res) => {
  console.log("query Result from req!: ", req.body.queryResult);
  const { parameters, outputContexts } = req.body.queryResult;
  if (parameters.yoyos && parameters.yoyos.length) {
    return res.json({
      fulfillmentText: `What would you like to know about ${parameters.yoyos}?`
    });
  } else if (parameters.specs) {
    const yoyo_id = outputContexts[0].parameters.yoyos.replace(/ /g, '');
    const spec = parameters.specs;
    let spec_value = yoyos.find(item => item.id == yoyo_id)[spec];
    let payload = { is_url: false };
    if (spec == 'image') {
      spec_value = `${BASE_URL}/images:${spec_value}`
      payload = {
        is_url: true
      }
    }

    return res.json({
      fulfillmentText: spec_value,
      payload
    });
  }

  const names = yoyos.map(({ name }) => name);

  return res.json({
    fulfillmentText: "The yoyos available are: " + names.join(', ')
  });
});

app.get('/images', (req, res) => {
  console.log('hereEEEEEEEEEEEEEEEEEEEEEE');
  const options = {
    root: path.join(__dirname, '../../FEC/scraped/photo'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  res.sendFile('1.jpg', options, (err) => {
    if(err) {
      console.log(err)
      next();
    } else {
      console.log('sent: 1.jpg')
    }
  });
})

app.listen(5000, () => {
  console.log('listening to 5000');
})