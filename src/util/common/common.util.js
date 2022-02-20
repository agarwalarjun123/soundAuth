const _ = require('lodash');

/**
 * @param obj
 * @description remove the null data
 */
const pruneDeep = (obj) => {
  _.each(obj, (value, key) => {
    if (_.isNil(value)) {
      delete obj[key];
    }
    if (_.isArray(value) && value.length === 0) {
      delete obj[key];
    }
    if (_.isObject(value)) pruneDeep(value);
  });
  return obj;
};

module.exports = pruneDeep;
