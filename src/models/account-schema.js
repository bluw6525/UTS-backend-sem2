const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  name: String,
  email: String,
  pin: String,
  balance: Number,
  history: [
    {
      type: Schema.Types.ObjectId,
      ref: 'transcation',
    },
  ],
});

module.exports = accountSchema;
