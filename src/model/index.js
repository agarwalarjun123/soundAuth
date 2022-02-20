/* eslint-disable global-require */
const models = {};
const setupModels = async () => {
  const mongoose = require('mongoose');
  const UserSchema = require('./user');
  const SessionSchema = require('./session')
  models.User = mongoose.model('User', UserSchema);
  models.Session = mongoose.model('Session',SessionSchema)
  return models;
};
module.exports = {
  setupModels,
  models,
};