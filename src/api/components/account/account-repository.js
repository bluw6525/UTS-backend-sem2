const { User, Account } = require('../../../models');

/**
 * Get user by account
 * @param {string} id -Account id
 * @returns {Promise}
 */
async function getUserbyAccount(id){
  return User.findOne({account: id})
}

/**
 * Get accounts
 * @returns {Promise}
 */
async function getAccounts(){
  return Account.find({});
}

/**
 * get account by id
 * @param {string} id -account id
 * @returns {Promise}
 */
async function getAccountbyId(id){
  return Account.findById(id);
}

/**
 * get user by email and name
 * @param {string} name -user name
 * @param {string} email -User email
 * @returns {Promise}
 */
async function getUserbyNameEmail(name, email) {
  return User.findOne({name, email});
};

/**
 * creating account and updating User
 * @param {string} name -account and user name
 * @param {string} email -account and user email
 * @param {string} pin -account pin
 * @param {number} balance -account balance
 * @returns {Promise}
 */
async function createAccount(name, email, pin, balance) {
  const account = await Account.create({
    name,
    email,
    pin,
    balance,
  });
  const user = await User.findOne({name, email});
  return User.updateOne(
    {
      _id : user.id,
    },
    {
      $push: {
        account : account.id,
      },
    }
  );
};

/**
 * changing account owner
 * @param {string} oldId -old owner User ID
 * @param {string} newId -new owner User ID
 * @param {string} accountId -account ID
 * @returns {Promise}
 */
async function changeAccountOwner(oldId, newId, accountId) {
  const user = await User.findById(newId);
  await User.updateOne(
    {
      _id: newId,
    },
    {
      $push: {
        account: accountId,
      },
    }
  );
  await User.updateOne(
    {
      _id: oldId,
    },
    {
      $pull: {
        account: accountId,
      },
    }
  );
  return Account.updateOne(
    {
      _id: accountId,
    },
    {
      $set: {
        name: user.name,
        email: user.email,
      },
    }
  );
}

/**
 * get account fieldname/key
 * @returns {object}
 */
async function getAccountskey() {
  return Object.keys((await Account.findOne()).toObject());
}

/**
 * Deleting account
 * @param {string} id -Account ID
 * @returns 
 */
async function deleteAccount(id){
  const user = await User.findOne({account : id});
  console.log(user);
  await User.updateOne(
    {
      _id: user.id,
    },
    {
      $pull: {
        account: id,
      },
    }
  );
  return Account.deleteOne({ _id: id });
}
module.exports = {
  getUserbyNameEmail,
  createAccount,
  changeAccountOwner,
  getAccounts,
  getAccountbyId,
  getAccountskey,
  deleteAccount,
  getUserbyAccount,
};