/* eslint-disable global-require */
const insights = require('applicationinsights');
const config = require('config');
const logger = require('./util/logger/logger.util');

async function bootstrap() {
  // database connection
  const dbHandler = require('./util/database');
  try {
    await dbHandler.connectDB();
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
  const app = require('./app');
  app.listen("3000","0.0.0.0", () => {
    logger.info(`Server running on PORT: ${config.APP.PORT}`);
  });
}
bootstrap();
