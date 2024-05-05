const express = require('express');
const transactionController = require('./transaction-controller');
const transactionValidator = require('./transaction-validator');
const celebrate = require('../../../core/celebrate-wrappers');

module.exports = (app) => {
  app.use('/transaction', route);
  
};