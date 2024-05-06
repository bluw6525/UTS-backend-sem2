const accountService = require('./account-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list Accounts
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getAccounts(request, response, next) {
  try {
    const search = request.query.search;
    const sort = request.query.sort || 'name:asc';
    const [fnSearch, iSearch] = await accountService.splitFormat(search);
    const regSearch = await accountService.regularExpression(fnSearch, iSearch);
    const [fnSort, iSort] = await accountService.splitFormat(sort);
    const accounts = await accountService.getAccounts(fnSearch, regSearch);
    const sorted = await accountService.accountSort(accounts, fnSort, iSort);
    return response.status(200).json(sorted);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create Account
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createAccount(request, response, next) {
  try {
    const { name, email, pin, balance } = request.body;
    const checkUserExist = await accountService.checkUserExist(name, email);
    if (!checkUserExist) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }
    const success = await accountService.createAccount(name, email, pin, balance); 
    if (!success) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Failed to create account');
    }
    return response.status(200).json({ name, email, pin, balance });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle changing account owner
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changeAccountOwner(request, response, next) {
  try {
    const accountId = request.params.id;
    const { newOwnerName, newOwnerEmail, pin } = request.body;
    const checkUserExist = await accountService.checkUserExist(newOwnerName, newOwnerEmail);
    if (!checkUserExist) {
      throw errorResponder(errorTypes.USER_NOT_FOUND, 'User not found');
    }
    const pinCorrect = await accountService.checkPin(accountId, pin);
    if (!pinCorrect) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'pin incorrect');
    }
    const checkOwner = await accountService.checkAccountOwner(newOwnerName, newOwnerEmail, accountId)
    if(!checkOwner){
      throw errorResponder(errorTypes.SAME_OWNER, 'old owner cant be the same as new one')
    }
    const success = await accountService.changeAccountOwner(
      newOwnerName,
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

/**
 * Handle deleting an account
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
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
    const pinCorrect = await accountService.checkPin(id, pin);
    if (!pinCorrect) {
      throw errorResponder(errorTypes.INVALID_PIN, 'pin incorrect');
    }
    const success = await accountService.deleteAccount(id);
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
