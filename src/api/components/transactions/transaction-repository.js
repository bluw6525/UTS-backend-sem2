const { User, Account, Transaction } = require('../../../models');

async function getAccountbyId(id){
  return Account.findById(id);
}

module.exports ={
  getAccountbyId,
  
}