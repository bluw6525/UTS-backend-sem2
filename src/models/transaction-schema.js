const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  date: Date,
  'To/from' : String,
  type: {
    type: String,
    enum: ['Money In', 'Money Out'],
  },
  amount: Number,
  description: String,
  reference: 
  {
    type: Schema.Types.ObjectId,
      ref: 'transcation',
  },
});

module.exports = transactionSchema;
