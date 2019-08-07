var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dongjae93:qkrehdwo7@connect4-xkfvh.mongodb.net/FEC?retryWrites=true&w=majority', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const itemSchema = new mongoose.Schema({
  id: Number,
  itemName: String,
  rating: Number,
  numRating: Number,
  category: String
})

const Item = mongoose.model('Item', itemSchema);

const getAllProducts = () => {
  
  return new Promise((res, rej) => {
    Item.find((err, items) => {
      if(err) {
        rej(err);
      } else {
        res(items);
      }
    })
    .sort({category: 1});
  })
}

const getCategoryProducts = (category) => {
  return new Promise((res, rej) => {
    Item
    .find({category: category}, (err, items) => {
      if(err) {
        rej(err);
      } else {
        res(items);
      }
    })
    .sort({rating: -1})
    .sort({numRating: -1})
  })
}


module.exports = { getAllProducts, getCategoryProducts }