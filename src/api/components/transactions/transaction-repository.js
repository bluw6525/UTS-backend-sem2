const { Account, Transaction } = require('../../../models');
const moment = require('moment');
async function getAccountbyId(id){
  return Account.findById(id);
}

async function createTransaction(senderId, receiverId, amount, description) {
  const sender = await Account.findById(senderId);
  const receiver = await Account.findById(receiverId);
  const senderTransaction = await Transaction.create({
    'date': moment().toDate(),
    'to/From': receiver.name,
    'type': 'Transfer',
    'amount': amount,
    'description': description,
  });

  const receiverTransaction = await Transaction.create({
    'date': moment().toDate(),
    'to/From': receiver.name,
    'type': 'Receive',
    'amount': amount,
    'description': description,
    'reference': senderTransaction.id,
  });


  await Transaction.updateOne(
    {
      _id: senderTransaction.id,
    },
    {
      $set: {
        reference: receiverTransaction.id,
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
      $inc:{
        balance: -amount,
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
      $inc:{
        balance: amount,
      },
    }
  );
}
module.exports = {
  getAccountbyId,
  createTransaction,
};
