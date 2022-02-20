const config = require('config');
const mongoose = require('mongoose');
const logger = require('../logger/logger.util');
const { setupModels } = require('../../model/index');
const constants = require('../constants');

const mongoServerOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  connectTimeoutMS: constants.db.MONGO_CONNECT_TIMEOUT,
  serverSelectionTimeoutMS: 180000,
};

mongoose.connection.on('disconnected', () => {
  logger.error('Mongo DB : Disconnected to DB');
});
mongoose.connection.on('error', () => {
  logger.error('Mongo DB: Error Connecting to DB');
});

mongoose.connection.on('reconnectFailed', () => {
  logger.error('Mongo DB: Reconnection Failed to DB');
});
mongoose.connection.on('reconnected', () => {
  logger.info('Mongo DB: Reconnected to DB');
});

let connection;
const connect = async () => {
  try {
    connection = await mongoose.connect(
      config.DB.MONGO.URI,
      mongoServerOptions
    );
    logger.info('Mongo DB: Connected to DB');
  } catch (err) {
    throw new Error(err);
  }
  try {
    await setupModels();
    logger.info('Mongo DB: Models Loaded.');
  } catch (err) {
    throw new Error(err);
  }
  return connection;
};

module.exports = { connect };
