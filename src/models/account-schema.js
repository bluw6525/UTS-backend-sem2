const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  date: Date,
  toWho: String,
  amount: Number,
  description: String,
});

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

module.exports = { accountSchema, transactionSchema };
