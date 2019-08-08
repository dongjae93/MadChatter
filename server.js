const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const BASE_URL = 'https://78bbe158.ngrok.io';
const db = require('./db/db.js');
// const d = require('../../FEC/scraped/photo/1.jpg')
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const yoyos = require('./yoyos.json');
const products = require('./data/products.json');
let found = products.find(item => item.id == 1)
app.post("/products", (req, res) => {
  const { parameters, outputContexts } = req.body.queryResult;
  if(parameters.category && parameters.category.length) {
    db.getCategoryProducts(parameters.category).then((categoryItems) => {
      return res.json({
        fulfillmentText: `Available ${parameters.category} items are ${categoryItems.map((item) => '\n' + item.itemName.split('-').join(' '))}`
      })
    })
  } else if (parameters.product && parameters.product.length) {
    return res.json({
      fulfillmentText: `What would you like to know about ${parameters.product}?`
    });
  } else if (parameters.specs) {
    console.log('context param: ', outputContexts[0].parameters);
    const contextParam = { 
      product:'IRWIN 16-oz Smooth Face Steel Head Fiberglass Framing Hammer',
      'product.original': 'hammer',
      specs: 'image',
      'specs.original': 'Images',
      category: 'Tools',
      'category.original': 'tools' 
    }
    const productName = outputContexts[0].parameters.product;
    db.getItemIdByItemName(productName.split(' ').join('-')).then((id) => {
      const spec = parameters.specs;
      let spec_value;
      let payload = { is_url: false };
      if (spec == 'image') {   
        spec_value = `${BASE_URL}/images:${id}`
        payload = {
          is_url: true
        }
        return res.json({
          fulfillmentText: spec_value,
          payload
        });
      } else {
        // let spec_value = yoyos.find(item => item.id == productName)[spec];
        spec_value = require(`./data/${id}.json`)
        console.log('spec', spec);
        console.log('spec_value before', spec_value.specs)
        spec_value = spec_value.specs.find((specification) => {
          if(specification.title === spec) {
            return specification['spec']
          }
        })
        spec_value = `The ${spec} of ${productName} is ${spec_value.spec}.`
        return res.json({
          fulfillmentText: spec_value,
          payload
        });
      }
    })
  } else {
    let names = yoyos.map(({ name }) => name);
    db.getCategoryProducts('Canvas').then((result) => {
      // console.log(result);
      names = result.map(({itemName}) => itemName.split('-').join(' '));
      // console.log('name: ', names)
      return res.json({
        fulfillmentText: `The available canvas products are: ` + names.join(', ')
      });
    }).catch((err = 'none') => {
      console.log(err)
      return res.json({
        fulfillmentText: "The yoyos available are: " + names.join(', ')
      });
    })
  }


});

app.get('/images', (req, res) => {
  // console.log('hereEEEEEEEEEEEEEEEEEEEEEE');
  const options = {
    root: path.join(__dirname, 'data/photo'),
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