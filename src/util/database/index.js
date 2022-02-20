const config = require('config');
const logger = require('../logger/logger.util');
const mongoDb = require('./mongodb-handler');

let connection = {};

const connectDB = async () => {
  if (config.DB.MONGO) {
    connection.mongo = await mongoDb.connect();
  } else {
    logger.error('Mongo DB: Configuration not available in config.');
  }
};

const disconnectDB = async () => {
  if (connection.mongo) {
    await connection.mongo.close();
  } else {
    logger.info('Mongo DB: Configuration not available in config.');
  }
};

module.exports = { connectDB, disconnectDB, connection };
