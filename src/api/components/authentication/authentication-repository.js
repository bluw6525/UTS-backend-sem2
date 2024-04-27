const { func } = require('joi');
const { User } = require('../../../models');
const moment = require('moment');
let attempts = [];

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function getUserAttempt(email) {
  return attempts.find(attempts => attempts.email === email);
}

async function setUserAttempt(email) {
  attempts.push({ email: email, attempt: 1, time: moment()});
}

async function updateUserAttempt(email){
  const attemptIndex = attempts.findIndex(attempts => attempts.email === email);
  attempts[attemptIndex].attempt += 1;
}
module.exports = {
  getUserByEmail,
  getUserAttempt,
  setUserAttempt,
  updateUserAttempt,
};
