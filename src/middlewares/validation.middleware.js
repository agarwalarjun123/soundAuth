const boom = require('@hapi/boom');
const { get } = require('lodash');
const errorDecorator = require('../util/error-decorator/error-decorator.util');
const logger = require('../util/logger/logger.util');

function ValidationMiddleware(schema, additionalProperties) {
  return errorDecorator((request, response, next) => {
    // Validate using the schema
    const result = schema.validate(request, {
      allowUnknown: true,
      convert: true,
    });
    // Check and handle error
    if (result.error) {
      let additionalLogs = '';
      if (additionalProperties) {
        additionalProperties.forEach((element) => {
          const elementValue = get(request, element);
          if (element) {
            additionalLogs += ` | ${element}: ${elementValue}`;
          }
        });
      }
      logger.error(
        `Validation failed: ${result.error.toString()} ${additionalLogs}`
      );
      throw boom.badRequest(result.error.toString());
    }
    Object.assign(request, result.value);
    return next();
  });
}

module.exports = ValidationMiddleware;
