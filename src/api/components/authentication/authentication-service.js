const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const moment = require('moment');

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}

async function updatingUserAttempt(email) {
  const checkattempt = await authenticationRepository.getUserAttempts(email);
  if (!!!checkattempt) {
    await authenticationRepository.setUserAttempt(email);
  } else {
    await authenticationRepository.updateUserAttempt(email);
  }
}

async function getUserAttempt(email) {
  const attempt = await authenticationRepository.getUserAttempts(email);
  return attempt['attempt'];
}

async function checkUserRateLimit(email) {
  const attempt = await authenticationRepository.getUserAttempts(email);
  if (!!attempt) {
    if (attempt['attempt'] >= 5) {
      if (moment().diff(attempt['time'], 'minutes') >= 30) {
        await authenticationRepository.resetUserAttempt(email);
        return false;
      } else {
        return true;
      }
    }
    return false;
  }
}

async function resettingUserAttempt(email) {
  await authenticationRepository.resetUserAttempt(email);
}

module.exports = {
  checkLoginCredentials,
  getUserAttempt,
  updatingUserAttempt,
  checkUserRateLimit,
  resettingUserAttempt,
};
