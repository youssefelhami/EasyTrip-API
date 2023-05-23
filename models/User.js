const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  }
});

userSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
  virtuals: true
});

userSchema.options.toJSON.transform = function(doc, ret) {
  delete ret._id;
  delete ret.__v;
  return ret;
};

module.exports = mongoose.model('User', userSchema);
