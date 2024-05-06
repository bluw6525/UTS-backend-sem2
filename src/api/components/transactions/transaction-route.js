const express = require('express');
const transactionController = require('./transaction-controller');
const transactionValidator = require('./transaction-validator');
const celebrate = require('../../../core/celebrate-wrappers');
const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const route = express.Router();
module.exports = (app) => {
  app.use('/transaction', route);
  route.post('/:id/transfer', authenticationMiddleware, celebrate(transactionValidator.transferMoney), transactionController.transferMoney);
  route.post('/:id/deposit', authenticationMiddleware, celebrate(transactionValidator.depositMoney), transactionController.depositMoney);
};