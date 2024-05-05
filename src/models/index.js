const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const accountSchema = require('./account-schema');
const transactionSchema = require('./transaction-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', usersSchema);
const Transaction = mongoose.model('transaction', transactionSchema);
const Account = mongoose.model('account', accountSchema);
module.exports = {
  mongoose,
  User,
  Account,
  Transaction,
};
