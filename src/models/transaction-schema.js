const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  date: Date,
  type: {
    type: String,
    enum: ['Money In', 'Money Out'],
  },
  recipient : String,
  amount: Number,
  description: String,
});

module.exports = transactionSchema;
