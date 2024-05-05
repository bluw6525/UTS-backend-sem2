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

async function getUserAttempts(email) {
  return attempts.find(attempts => attempts.email === email);
}

async function setUserAttempt(email) {
  attempts.push({ email: email, attempt: 0, time: moment()});
}

async function updateUserAttempt(email){
  const attemptIndex = attempts.findIndex(attempts => attempts.email === email);
  attempts[attemptIndex].attempt += 1;
  attempts[attemptIndex].time = moment()
}

async function resetUserAttempt(email){
  const attemptIndex = attempts.findIndex(attempts => attempts.email === email);
  attempts[attemptIndex].attempt = 0;
  attempts[attemptIndex].time = moment()
}
module.exports = {
  getUserByEmail,
  getUserAttempts,
  setUserAttempt,
  updateUserAttempt,
  resetUserAttempt,
};
