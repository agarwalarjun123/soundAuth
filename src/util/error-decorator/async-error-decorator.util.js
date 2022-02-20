const logger = require('../logger/logger.util');
const { trackException } = require('../appinsights');

const asyncErrorDecorator = (fn, ...param) => {
  if (typeof fn === 'function') {
    fn(...param)
      .then((result) => {
        logger.info(`${fn.name} completed with result : ${result}`);
      })
      .catch((err) => {
        logger.error(`Error occurred: ${err.message}`);
        logger.error(err.stack);
        trackException(err);
      });
  } else {
    logger.error(
      'asyncErrorDecorator: First argument passed is not a function'
    );
  }
};

module.exports = asyncErrorDecorator;
