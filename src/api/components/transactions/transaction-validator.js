const joi = require('joi');
const { depositMoney } = require('./transaction-service');

module.exports = {
  transferMoney: {
    body: {
      receiverId : joi.string().required().label('receiver id'), 
      amount : joi.number().required().label('amount'), 
      pin : joi.string().min(6).max(6).pattern(/^\d+$/).required().label('Pin'), 
      description : joi.string().min(6).max(100).optional(),
    },
  },

  depositMoney:{
    body:{
      amount : joi.number().required().label('amount'), 
      pin: joi.string().min(6).max(6).pattern(/^\d+$/).required().label('Pin'), 
      description : joi.string().min(6).max(100).optional(),
    }
  }
};