const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  client_id: {
    type: String,
    required: true,
  },
  secret: {
    type: String,
    required: true,
  },
  key: {
    type: String,

  }
});

module.exports = mongoose.model('Auth', authSchema);