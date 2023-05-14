const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  client_id: {
    type: String,
    required: true,
    // unique: true
  },
  secret: {
    type: String,
    required: true,
    // unique: true
  },
  key: {
    type: String,
    // required: true,
    // unique: true
  }
});

module.exports = mongoose.model('Auth', authSchema);