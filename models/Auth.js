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

authSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
authSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Auth', authSchema);