let joi = require('joi').extend(require('@hapi/joi-date'));
joi = joi.extend(require('joi-phone-number'));
joi.objectId = require('joi-objectid')(joi);

/**
 * @description x-user-details schema
 */
const headersSchema = joi
  .object({
    hrxId: joi.objectId().required(),
    phrIds: joi.array().required().min(1),
    masterPhrId: joi.objectId(),
    mobileNumber: joi.string(),
  })
  .options({ allowUnknown: true });

const dateSchema = joi.date().utc();

const mobileNumberSchema = joi.string().phoneNumber({
  defaultCountry: 'IN',
  format: 'e164',
});
const emailSchema = joi.string().email();

const stripString = (schema) =>
  joi.alternatives().try(joi.string().trim().valid('').strip(), schema);

module.exports = {
  headersSchema,
  dateSchema,
  stripString,
  mobileNumberSchema,
  emailSchema,
};
