const authService = require('./auth.service');
const errorDecorator = require('../../../util/error-decorator/error-decorator.util');

const requestOTP = errorDecorator(async (req, _res, next) => {
  const { email, source } = req.body;
  const data = await authService.requestOTP({
    source, email
  });
  return next(data);
});

const validateOTP = errorDecorator(async (req, _res, next) => {
  const { otp,session_id } = req.body;
  const data = await authService.validateOTP(otp,session_id);
  return next(data);
});

const generateAuthSoundToken = errorDecorator(async (req, _res, next) => {
  const id = req.user
  const data = await authService.generateAuthSoundToken(id);
  return next(data);
});

const verifyAuthSoundToken = errorDecorator(async (req, _res, next) => {
  const token = req.headers["soundauthorization"];
  const data = await authService.verifyAuthSoundToken(token);
  return next(data);
});
const profile = errorDecorator(async (req, _res, next) => {
  const id = req.user
  const data = await authService.profile(id);
  return next(data);
});

module.exports = {
  requestOTP,
  validateOTP,
  generateAuthSoundToken,
  verifyAuthSoundToken,
  profile
};
