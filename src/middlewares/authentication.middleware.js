const _ = require("lodash");
const boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  console.log(req.headers)
  const token = _.get(req, "headers.authorization");
  if (!token) {
    throw boom.badRequest("Token Malformed.");
  }
  let payload;
  try {
    payload = jwt.verify(token, "PRIVATE_KEY");
  } catch (error) {
    throw boom.badRequest("Invalid Token.");
  }
  req.user = payload.id;
  return next();
};
module.exports = authenticate