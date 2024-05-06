const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  date: Date,
  'ToFrom' : String,
  type: {
    type: String,
    enum: ['Transfer', 'Deposit', 'Receive'],
  },
  amount: Number,
  description: String,
  reference: 
  {
    type: Schema.Types.ObjectId,
      ref: 'transaction',
  },
});

module.exports = transactionSchema;
