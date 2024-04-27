const moment = require('moment');
const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      await authenticationServices.updatingUserAttempt(email);
      const userAttempt = await authenticationServices.getUserAttempt(email);
      console.log('[' + moment().format('YYYY-mm-DD hh:mm:ss').toString() + ']' + ' User ' + email + ' gagal login. Attempt:' +userAttempt);
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password,  attempt: ' + userAttempt,
      );
    }
    else{
      
    }
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
