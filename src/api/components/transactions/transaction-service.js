const transactionRepository = require('./transaction-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

async function checkPin(id, pin){
  const account = transactionRepository.getAccountbyId(id);
  const pinMatch = await passwordMatched(pin, account.pin);
  return pinMatch;
}

async function checkAccountBalance(id, amount){
  const account = transactionRepository.getAccountbyId(id);
  if(account.balance >= amount){
    return true;
  }
  return false;
}

async function makeTranscation(senderId, receiverId, amount, description){
  try{
    await transactionRepository.createTransaction(senderId,receiverId,amount, description);
  }
  catch(err){
    return false;
  }
  return true;
}

module.exports ={
  checkPin,
  checkAccountBalance,
  makeTranscation,
}