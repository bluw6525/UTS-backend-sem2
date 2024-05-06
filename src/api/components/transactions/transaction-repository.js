const { Account, Transaction } = require('../../../models');
const moment = require('moment');

/**
 * Get Account detail
 * @param {string} id -Account ID
 * @returns {Promise}
 */
async function getAccountbyId(id){
  return Account.findById(id);
}

/**
 * Create new Transaction
 * @param {*} senderId  -Sender Account ID
 * @param {*} receiverId  -Receiver Account ID
 * @param {*} amount -Total Amount Transfered
 * @param {*} description -Transfer Description
 * @returns {Promise}
 */
async function createTransaction(senderId, receiverId, amount, description) {
  const sender = await Account.findById(senderId);
  const receiver = await Account.findById(receiverId);
  //create sender transaction
  const senderTransaction = await Transaction.create({
    'date': moment().toDate(),
    'ToFrom': receiver.name,
    'type': 'Transfer',
    'amount': amount,
    'description': description,
  });
  //create receiver transaction
  const receiverTransaction = await Transaction.create({
    'date': moment().toDate(),
    'ToFrom': sender.name,
    'type': 'Receive',
    'amount': amount,
    'description': description,
    'reference': senderTransaction.id,
  });
  //updating sender transaction reference to receiver id
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
  //adding sender transaction and decrease amout from sender account
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
  //adding receiver transaction and increase amout from receiver account
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
