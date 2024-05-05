const logger = require('../src/core/logger')('api');
const { User, Account, Transaction } = require('../src/models');
const { hashPassword } = require('../src/utils/password');
const moment = require('moment');
const name = 'Administrator';
const email = 'admin@example.com';
const password = '123456';
const pin = '123456';
const balance = 100;
const transfer = 10;
logger.info('Creating default users');

(async () => {
  try {
    const numUsers = await User.countDocuments({
      name,
      email,
    });
    if (numUsers > 0) {
      throw new Error(`User ${email} already exists`);
    }
    const hashedPassword = await hashPassword(password);
    const hashedPin = await hashPassword(pin);
    const sender = await Transaction.create({
      'date': Date.now(),
      'To/from': name,
      'type': 'Money Out',
      'amount': transfer,
      'description': 'fund transfer',
    });
    const receiver = await Transaction.create({
      'date': Date.now(),
      'To/from': name,
      'type': 'Money In',
      'amount': transfer,
      'description': 'fund transfer',
      'reference': sender.id,
    });
    await Transaction.updateOne(
      {
        _id: sender.id,
      },
      {
        $set: {
          reference: receiver.id,
        },
      }
    );
    const account = await Account.create({
      name,
      email,
      pin: hashedPin,
      balance,
      history: [sender.id, receiver.id],
    });
    await User.create({
      name,
      email,
      password: hashedPassword,
      account: account,
    });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();
