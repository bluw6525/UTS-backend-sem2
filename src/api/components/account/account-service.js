const accountRepository = require('./account-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * get account
 * @param {string} searchfn -search fieldname
 * @param {RegExp} searchkey -search key
 * @returns {Array}
 */
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

/**
 * check if user exist
 * @param {string} name -User name
 * @param {string} email -User email
 * @returns {boolean}
 */
async function checkUserExist(name, email) {
  const user = await accountRepository.getUserbyNameEmail(name, email);
  return !!user;
}

/**
 * Check if Account Owner is the same
 * @param {string} name -Account name
 * @param {sting} email -Account email
 * @param {string} id -Account ID
 * @returns {boolean}
 */
async function checkAccountOwner(name, email, id) {
  const account = await accountRepository.getAccountbyId(id);
  console.log(account);
  if (account.name === name && account.email === email) {
    return false;
  }
  return true;
}

/**
 * Deleting an Account
 * @param {string} id -Account ID
 * @returns {boolean}
 */
async function deleteAccount(id) {
  const success = await accountRepository.deleteAccount(id);
  return !!success;
}

/**
 * Creating new Account
 * @param {string} name -Account name
 * @param {string} email -Account email
 * @param {string} pin -Account pin
 * @param {number} balance -Account balance
 * @returns {boolean}
 */
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

/**
 * Checking pin correct
 * @param {string} id -Account ID
 * @param {string} pin -Account pin
 * @returns {boolean}
 */
async function checkPin(id, pin) {
  const account = await accountRepository.getAccountbyId(id);
  const pinMatch = await passwordMatched(pin, account.pin);
  return !!pinMatch;
}

/**
 * Changing Account Owner
 * @param {string} newOwnerName -new owner Account name
 * @param {string} newOwnerEmail -new owner Account email
 * @param {string} accountId -old owner id
 * @returns
 */
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

/**
 * splitting format when encounter :
 * @param {string} query -query that want to be split
 * @returns {string, string}
 */
async function splitFormat(query) {
  if (!!query) {
    const fieldname = query.match(/^[^:]+/) ? query.match(/^[^:]+/)[0] : null;
    const key = query.match(/(?<=:).+$/) ? query.match(/(?<=:).+$/)[0] : null;
    return [fieldname, key];
  } else {
    return [null, null];
  }
}

/**
 * changing key into pattern
 * @param {string} fieldname - fieldname
 * @param {string} key - pattern key
 * @returns {RegExp}
 */
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

/**
 * Sorting Array by fieldname and key
 * @param {Array} users -Users array object
 * @param {string} fieldname -sort field name
 * @param {RegExp} key -sort key
 * @returns {string}
 */
async function accountSort(account, fieldname, key) {
  const accountkey = await accountRepository.getAccountskey();
  const sortedAccount = await account.sort((a, b) => {
    if (key === 'asc' && accountkey.includes(fieldname)) {
      if (typeof a[fieldname] === 'number') {
        return a[fieldname] - b[fieldname];
      } else {
        return a[fieldname].localeCompare(b[fieldname]);
      }
    } else if (key === 'desc' && accountkey.includes(fieldname)) {
      if (typeof a[fieldname] === 'number') {
        return b[fieldname] - a[fieldname];
      } else {
        return b[fieldname].localeCompare(a[fieldname]);
      }
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
