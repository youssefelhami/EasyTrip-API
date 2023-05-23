const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  ticket: {
    type: Number,
    min: 0,
    required: true
  },
  daily_accommodation: {
    type: Number,
    min: 0,
    required: true
  },
  daily_food: {
    type: Number,
    min: 0,
    required: true
  },
  daily_miscellaneous: {
    type: Number,
    min: 0,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  }
});

tripSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
tripSchema.set('toJSON', {
  virtuals: true
});

tripSchema.options.toJSON.transform = function(doc, ret) {
  delete ret._id;
  delete ret.__v;
  return ret;
};


module.exports = mongoose.model('Trip', tripSchema);
