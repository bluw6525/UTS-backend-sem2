const express = require('express');
const transactionController = require('./transaction-controller');
const transactionValidator = require('./transaction-validator');
const celebrate = require('../../../core/celebrate-wrappers');
const authenticationMiddleware = require('../../middlewares/authentication-middleware');

module.exports = (app) => {
  app.use('/transaction', route);
  route.post('/:id', authenticationMiddleware, celebrate(transactionController.transferMoney), transactionController.transferMoney);
};