const transactionServices = require('./transaction-service');
const { errorResponder, errorTypes } = require('../../../core/errors');


/**
 * Handle transfer money
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function transferMoney(request, response, next) {
  try {
    const senderId = request.params.id;
    const { receiverId, amount, pin} = request.body;
    const description = request.body.description || 'fund transfer';
    const pinCorrect = await transactionServices.checkPin(senderId, pin);
    if(senderId === receiverId){
      throw errorResponder(errorTypes.SAME_ACCOUNT, 'sender and receiver cant be the same')
    }
    if (!pinCorrect) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'pin incorrect');
    }
    const balanceEnough = await transactionServices.checkAccountBalance(
      senderId,
      amount
    );
    if (!balanceEnough) {
      throw errorResponder(errorTypes.INSUFFICIENT_FUNDS, 'balance not enough');
    }
    const success = await transactionServices.makeTransaction(
      senderId,
      receiverId,
      amount,
      description
    );
    if(!success){
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong account id');
    }
    return response.status(200).json({status : 'success', to: receiverId, amount});
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle deposit money
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function depositMoney(request, response, next){
  try{
    const accountId = request.params.id;
    const amount = request.body.amount;
    const description = request.body.description || 'deposit money';
    const success = await transactionServices.depositMoney(accountId, amount, description);
    if(!success){
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong account id');
    }
    return response.status(200).json({status : 'success', to: accountId, amount});
  }catch(error){
    return next(error);
  }
}

module.exports = {
  transferMoney,
  depositMoney
};
