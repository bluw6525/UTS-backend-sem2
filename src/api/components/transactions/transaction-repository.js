const { Account, Transaction } = require('../../../models');
const moment = require('moment');
async function getAccountbyId(id) {
  return Account.findById(id);
}

async function createTransaction(senderId, receiverId, amount, description) {
  const sender = await Account.findById(senderId);
  const receiver = await Account.findById(receiverId);
  const senderTransaction = await Transaction.create({
    'date': moment().toDate(),
    'to/From': receiver.name,
    'type': 'Money Out',
    'amount': amount,
    'description': description,
  });

  const receiverTransaction = await Transaction.create({
    'date': moment().toDate(),
    'to/From': receiver.name,
    'type': 'Money Out',
    'amount': amount,
    'description': description,
    'reference': senderTransaction.id,
  });

  await Transaction.updateOne(
    {
      _id: receiverId,
    },
    {
      $set: {
        reference: receiverTransaction,
      },
    }
  );

  await Account.updateOne(
    {
      _id: sender.id,
    },
    {
      $push: {
        history: senderTransaction.id,
      },
    }
  );
  return Account.updateOne(
    {
      _id: receiver.id,
    },
    {
      $push: {
        history: receiverTransaction.id,
      },
    }
  );
}
module.exports = {
  getAccountbyId,
  createTransaction,
};
