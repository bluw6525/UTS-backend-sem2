const express = require('express');

const accountControllers = require('./account-controller');
const accountValidators = require('./account-validator');
const celebrate = require('../../../core/celebrate-wrappers');
const authenticationMiddleware = require('../../middlewares/authentication-middleware');

const route = express.Router();

module.exports = (app) => {
  app.use('/account', route);

  route.get('/', authenticationMiddleware, usersControllers.getAccounts);

  route.post('/', authenticationMiddleware, celebrate(accountValidators.createAccount), accountControllers.createAccount);

  route.put('/:id', authenticationMiddleware, celebrate(accountValidators.changeAccountOwner), accountControllers.changeAccountOwner);

  route.delete('/:id', authenticationMiddleware,celebrate(accountValidators.deleteAccount), accountControllers.deleteAccount);
};