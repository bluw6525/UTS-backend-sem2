const transactionRepository = require('./transaction-repository');
const { passwordMatched } = require('../../../utils/password');

/**
 * Check whether the password is correct or not
 * @param {string} id -Account ID
 * @param {string} pin -Account PIN
 * @returns {boolean}
 */
async function checkPin(id, pin) {
  const account = await transactionRepository.getAccountbyId(id);
  const pinMatch = await passwordMatched(pin, account.pin);
  return !!pinMatch;
}

/**
 * Check whether the Account have enough balance
 * @param {string} id -Account ID
 * @param {number} amount -Amount being transfered
 * @returns {boolean}
 */
async function checkAccountBalance(id, amount){
  const account = await transactionRepository.getAccountbyId(id);
  if(account.balance >= amount){
    return true;
  }
  return false;
}


/**
 * creating new transaction transfer
 * @param {string} senderId -Sender Account ID
 * @param {string} receiverId  -Receiver Account ID
 * @param {number} amount -Amount being transfered
 * @param {string} description -Transfer Description
 * @returns {boolean}
 */
async function makeTransaction(senderId, receiverId, amount, description){
  try{
    await transactionRepository.createTransaction(senderId,receiverId,amount, description);
  }
  catch(err){
    return false;
  }
  return true;
}

/**
 * creating new transaction deposit
 * @param {string} id -Account ID
 * @param {number} amount -Amount dposited
 * @param {string} description -transaction decription
 * @returns 
 */
async function depositMoney(id, amount, description){
  try{
    await transactionRepository.makeDeposit(id, amount, description);
  } catch(err){
    return false;
  }
  return true;
}

module.exports ={
  checkPin,
  checkAccountBalance,
  makeTransaction,
  depositMoney,
}