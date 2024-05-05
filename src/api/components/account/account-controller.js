const accountService = require('./account-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getAccounts(request, response, next) {
  try {
    const search = request.query.search;
    const [fnSearch, iSearch] = await accountService.splitFormat(search);
    const regSearch = await accountService.regularExpression(fnSearch, iSearch);
    const [fnSort, iSort] = await accountService.splitFormat(sort);
    const accounts = await accountService.getAccounts(fnSearch, regSearch);
    return response.status(200).json(accounts);
  } catch (error) {
    return next(error);
  }
}


async function createAccount(request, response, next) {
  try {
    const { name, email, pin, balance } = request.body;
    const userExist = await accountService.checkUserExist(email);
    if (!userExist) {
      throw errorResponder(errorTypes.USER_NOT_FOUND, 'User not found');
    }
    const success = await createAccount(name, email, pin, balance);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'failed to create account'
      );
    }
    return response.status(200).json({name, email, pin, balance})
  } catch (error) {
    return next(error);
  }
}

async function changeAccountOwner(request, response, next) {
  try {
    const accountId = request.params.id;
    const { newOwnerEmail, pin } = request.body;
    const checkUserExist = await accountService.checkUserExist(email);

    if (!checkUserExist) {
      throw errorResponder(errorTypes.USER_NOT_FOUND, 'User not found');
    }
    const pinCorrect = await accountService.checkPin(accountId, pin);
    if (!pinCorrect) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'pin incorrect');
    }
    const success = await accountService.changeAccountOwner(
      newOwnerEmail,
      accountId
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'failed to change account owner'
      );
    }
    return response.status(200).json({status : 'success change owner'})
  } catch (error) {
    return next(error);
  }
}

async function deleteAccount(request, response, next) {
  try {
    const id = request.params.id;
    const { pin, confirmPin } = request.body;
    if (pin !== confirmPin) {
      throw errorResponder(
        errorTypes.INVALID_PIN,
        'pin and confirm pin missmatch'
      );
    }
    const pinCorrect = await accountService.checkPin(pin);
    if (!pinCorrect) {
      throw errorResponder(errorTypes.INVALID_PIN, 'pin incorrect');
    }

    const success = await accountService.deleteAccount(Id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'failed to delete account'
      );
    }
    return response.status(200).json({status : 'deleted'})
  } catch (error) {
    return next(error);
  }
}
module.exports = {
  createAccount,
  changeAccountOwner,
  getAccounts,
  deleteAccount,
};
