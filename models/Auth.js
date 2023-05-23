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

authSchema.options.toJSON.transform = function(doc, ret) {
  delete ret._id;
  delete ret.__v;
  return ret;
};

module.exports = mongoose.model('Auth', authSchema);