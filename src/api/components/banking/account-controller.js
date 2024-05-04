const accountService = require('./account-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function createAccount(request, response, next) {
  try {
    const { name, email, pin, balance } = request.body;
    const userExist = await accountService.checkUserExist(name, email);
    if(!userExist){
      throw errorResponder(
        errorTypes.USER_NOT_FOUND,
        'User not found'
      );
    }
    const success = await createAccount(name, email, pin, balance);
    if(!success){
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'failde to create account'
      )
    }
  } catch (error) {
    return next(error);
  }
}

async function changeAccountOwner(request, response, next){
  try{
    
  } catch(error){
    return next(error);
  }
}
module.exports = {
  createAccount,
};