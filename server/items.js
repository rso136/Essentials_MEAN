var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  email: {
    type: String
  },
  userID: {
    type: String
  },
  item: {
  	type: String,
    lowercase: true
  },
  category: {
  	type: String
  },
  quantity: {
  	type: Number
  },
  shopping: {
  	type: Number
  },

});

var items = mongoose.model('items', ItemSchema);
module.exports = items;