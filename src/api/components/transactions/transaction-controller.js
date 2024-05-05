const transactionServices = require('./transaction-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function transferMoney(request, response, next) {
  try {
    const senderId = request.params.id;
    const { receiverId, amount, pin} = request.body;
    const description = request.body.description || 'fund transfer';
    const pinCorrect = await transactionServices.checkPin(senderId, pin);
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
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong account id')
    }
    return response.status(200).json({status : 'success', to: receiverId, amount});
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  transferMoney,
};
