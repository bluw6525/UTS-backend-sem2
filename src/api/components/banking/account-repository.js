const { User, Account, Transaction } = require('../../../models');


async function getUser(name, email) {
  return User.findOne({name, email});
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

module.exports = {
  getUser,
  createAccount,
  changeAccountOwner,
};