const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const { deleteAccount } = require('./account-repository');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createAccount:{
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      pin: joi.string().min(6).max(6).pattern(/^\d+$/).required().label('Pin'),
      balance: joi.number().positive().required().label('Balance'),
    },
  },

  changeAccountOwner:{
    body:{
      newOwnerEmail: joi.string().email().required().label('Email'),
      pin:  joi.string().min(6).max(6).pattern(/^\d+$/).required().label('Pin'),
    },
  },

  deleteAccount:{
    body:{
      pin: joi.string().min(6).max(6).pattern(/^\d+$/).required().label('Pin'),
      confirmPin: joi.string().min(6).max(6).pattern(/^\d+$/).required().label('Confirmation Pin'),
    },
  },
};
