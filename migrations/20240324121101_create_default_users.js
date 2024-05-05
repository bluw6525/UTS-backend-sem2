const logger = require('../src/core/logger')('api');
const { User, Account } = require('../src/models');
const { hashPassword } = require('../src/utils/password');
const name = 'Administrator';
const email = 'admin@example.com';
const password = '123456';
const pin = '123456';
const balance = 100;
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
    const account = await Account.create({
      name,
      email,
      pin : hashedPin,
      balance,
    });
    await User.create({
      name,
      email,
      password: hashedPassword,
      account : account,
    });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();
