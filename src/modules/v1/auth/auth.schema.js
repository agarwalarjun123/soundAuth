const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

const get = joi.object({
  params: joi
    .object()
    .keys({
      id: joi.objectId().required(),
    })
    .required()
    .options({ allowUnknown: true }),
});

const mapPackage = joi.object({
  params: joi
    .object()
    .keys({
      id: joi.objectId().required(),
      package_id: joi.objectId().required(),
    })
    .required()
    .options({ allowUnknown: true }),
});

module.exports = {
  get,
  mapPackage,
};
