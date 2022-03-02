/* eslint-disable global-require */
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
  app.listen(config.APP.PORT, () => {
    logger.info(`Server running on PORT: ${config.APP.PORT}`);
  });
}
bootstrap();
