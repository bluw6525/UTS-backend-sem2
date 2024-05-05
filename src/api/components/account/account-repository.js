const { User, Account } = require('../../../models');

async function getAccounts(){
  return Account.find({});
}

async function getAccountbyId(id){
  return Account.findById(id);
}

async function getUserbyEmail(email) {
  return User.findOne({email});
};

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

async function changeAccountOwner(newId, oldId, accountId) {
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
  const user = await User.findById(newId);
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

async function getAccountskey() {
  return Object.keys((await Account.findOne()).toObject());
}

async function deleteAccount(id){
  const user = await Account.findOne({account : id});
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
  getUserbyEmail,
  createAccount,
  changeAccountOwner,
  getAccounts,
  getAccountbyId,
  getAccountskey,
  deleteAccount,
};