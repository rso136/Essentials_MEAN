var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String
  },
  pass: {
  	type: String
  }
});

var users = mongoose.model('users', UserSchema);
module.exports = users;