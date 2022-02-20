const httpStatusCodes = require('http-status-codes');
const mongoose = require('mongoose');
const _ = require('lodash');

const checkAvailability = () => (_req, res) => {
  if (
    _.every([ mongoose.connection.readyState === 1])
  ) {
    return res.json({
      is_success: true,
    });
  }
  return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
    is_success: false,
  });
};
module.exports = checkAvailability;
