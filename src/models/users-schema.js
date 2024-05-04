const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usersSchema = new Schema({
  name: String,
  email: String,
  password: String,
  account: [
    {
      type: Schema.Types.ObjectId,
      ref: 'banking',
    },
  ],
});

module.exports = usersSchema;
