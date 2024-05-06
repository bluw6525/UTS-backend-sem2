const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  date: Date,
  'To/from' : String,
  type: {
    type: String,
    enum: ['Transfer', 'Receive'],
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
