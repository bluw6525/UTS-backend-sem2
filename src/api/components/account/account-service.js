const accountRepository = require('./account-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

async function getAccounts(searchfn, searchkey) {
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
  } else {
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
async function checkUserExist(name, email) {
  const user = await accountRepository.getUserbyNameEmail(name, email);
  return !!user;
}

async function checkAccountOwner(name, email, id){
  const account = await accountRepository.getAccountbyId(id);
  console.log(account)
  if(account.name === name && account.email === email){
    return false;
  }
  return true;
}
async function deleteAccount(id) {
  const success = await accountRepository.deleteAccount(id);
  return !!success;
}

async function createAccount(name, email, pin, balance) {
  const hashedPin = await hashPassword(pin);
  const success = await accountRepository.createAccount(
    name,
    email,
    hashedPin,
    balance
  );
  return !!success;
}

async function checkPin(id, pin) {
  const account = await accountRepository.getAccountbyId(id);
  const pinMatch = await passwordMatched(pin, account.pin);
  return pinMatch;
}

async function changeAccountOwner(newOwnerName, newOwnerEmail, accountId) {
  const oldUser = await accountRepository.getUserbyAccount(accountId);
  const newUser = await accountRepository.getUserbyNameEmail(
    newOwnerName,
    newOwnerEmail
  );
  const success = await accountRepository.changeAccountOwner(
    oldUser.id,
    newUser.id,
    accountId
  );
  return !!success;
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
  const accountkey = await accountRepository.getAccountskey();
  let pattern;
  if (accountkey.includes(fieldname)) {
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

async function accountSort(account, fieldname, key) {
  const accountkey = await accountRepository.getAccountskey();
  const sortedAccount = await account.sort((a, b) => {
    if (key === 'asc' && accountkey.includes(fieldname)) {
      return a[fieldname].localeCompare(b[fieldname]);
    } else if (key === 'desc' && accountkey.includes(fieldname)) {
      return b[fieldname].localeCompare(a[fieldname]);
    } else {
      return a['email'].localeCompare(b['email']);
    }
  });
  return sortedAccount;
}

module.exports = {
  createAccount,
  checkUserExist,
  checkPin,
  getAccounts,
  splitFormat,
  regularExpression,
  deleteAccount,
  changeAccountOwner,
  checkAccountOwner,
  accountSort,
};
