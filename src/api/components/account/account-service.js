const accountRepository = require('./account-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

async function getAccounts() {
  const accounts = await accountRepository.getAccounts();
  const results = [];
  const accountkey = await accountRepository.getAccountskey();
  if (!!searchfn && !!searchkey && accountkey.includes(searchfn)) {
    for (let i = 0; i < accounts.length; i += 1) {
      const account = accounts[i];
      if (searchkey.test(account[searchfn])) {
        results.push({
          id: account.id,
          name: account.name,
          email: account.email,
          balance: account.balance,
        });
      }
    }
  }
  else{
    for (let i = 0; i < accounts.length; i += 1) {
      const account = accounts[i];
      results.push({
        id: account.id,
        name: account.name,
        email: account.email,
        balance: account.balance,
      });
    }
  }
  return results;
}
async function checkUserExist(email) {
  const user = await accountRepository.getUserbyEmail(email);
  return !!!user;
}

async function deleteAccount(id, pin){
  try{
    const hashedPin = await hashPassword(pin);
    await accountRepository.deleteAccount(id);
  } catch(err){
    return false;
  }
  return null;
}

async function createAccount(name, email, pin, balance) {
  try {
    const hashedPin = await hashPassword(pin);
    await accountRepository.createAccount(name, email, hashedPin, balance);
  } catch (err) {
    return false;
  }
  return true;
}

async function checkPin(id, pin) {
  const account = accountRepository.getAccountbyId(id);
  const pinMatch = await passwordMatched(pin, account.pin);
  return pinMatch;
}

async function changeAccountOwner(newOwnerEmail, accountId) {
  try {
    const oldUser = await accountRepository.getAccountsbyId(accountId);
    const newUser = await accountRepository.getUserbyEmail(newOwnerEmail);
    await accountRepository.changeAccountOwner(
      oldUser.id,
      newUser.id,
      accountId
    );
  } catch (err) {
    return false;
  }
  return true;
}

async function splitFormat(query) {
  if (!!query) {
    const fieldname = query.match(/^[^:]+/) ? query.match(/^[^:]+/)[0] : null;
    const key = query.match(/(?<=:).+$/) ? query.match(/(?<=:).+$/)[0] : null;
    return [fieldname, key];
  } else {
    return [null, null];
  }
}

async function regularExpression(fieldname, key) {
  console.log(fieldname, key);
  const userkey = await usersRepository.getUserkey();
  let pattern;
  if (userkey.includes(fieldname)) {
    if (!!key) {
      pattern = new RegExp(key, 'i');
    } else {
      pattern = new RegExp('.*', 'i');
    }
    return pattern;
  } else {
    return;
  }
}

module.exports = {
  createAccount,
  checkUserExist,
  checkPin,
  getAccounts,
  splitFormat,
  regularExpression,
  deleteAccount,
};
