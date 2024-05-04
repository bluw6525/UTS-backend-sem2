const accountRepository = require('./account-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

async function checkUserExist(name, email){
  const user = await accountRepository.getUser(name, email);
  return !!!user;
}

async function createAccount(name, email, pin, balance){
  const hashedPin = await hashPassword(pin);
  try {
    await accountRepository.createAccount(name, email, hashedPin, balance);
  } catch (err) {
    return false;
  }
  return true;
}

module.exports = {
  createAccount,
  checkUserExist,
};