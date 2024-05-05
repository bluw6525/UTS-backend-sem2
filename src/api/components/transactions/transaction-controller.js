const transactionServices = require('./transaction-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function transferMoney(request, response, next){
  const sender = request.params.id;
  const {receiver, amount, pin} = request.body;
  const pinCorrect = await transactionServices.checkPin(sender, pin);
  if (!pinCorrect) {
    throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'pin incorrect');
  }
}