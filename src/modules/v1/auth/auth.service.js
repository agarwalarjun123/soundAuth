const { v4    } = require("uuid");
const moment = require("moment");
const { generateOTP, hashOTP } = require("./auth.util");
const boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const {sendOTPMessage} = require("../../../util/email/email.util")
const { models } = require("../../../model");
const constant = require("../../../util/constants");

const requestOTP = async ({ source, email }) => {
  const session_id = v4();
  const start_time = moment.utc().toISOString();
  const { otp, hashedOTP } = generateOTP();
  const payload = {
    session_id,
    source,
    email,
    metrics: {
      start_time,
    },
    hashedOTP,
  };
  await new models.Session(payload).save();
  await sendOTPMessage({otp, email})
  return {
    otp,
    session_id,
  };
};
const validateOTP = async (otp, session_id) => {
  const hashedOTP = hashOTP(otp);
  const session = await models.Session.findOne({ session_id });
  if (!session) {
    throw boom.badRequest("Invalid Session.");
  }
  if (session.hashedOTP !== hashedOTP) {
    session.metrics.invalid_attempts = session.metrics.invalid_attempts + 1;
    await session.save();
    throw boom.badRequest("Invalid OTP Entered.");
  }
  session.metrics.end_time = moment.utc().toISOString();
  await session.save();
  const user = await models.User.findOneAndUpdate(
    {
      source: session.source,
      email: session.email,
    },
    {
      source: session.source,
      email: session.email,
    },
    { upsert: true, new: true }
  );
  const token = jwt.sign({id:user.id}, "PRIVATE_KEY", {
    expiresIn: constant.TOKEN_EXPIRY,
  });

  return {
    token,
  };
};

const generateAuthSoundToken = async (id) => {
  const user = await models.User.findById(id);
  const session_id = v4();
  await new models.Session({
    source: user.source,
    email: user.email,
    metrics: {
      start_time: moment.utc().toISOString(),
    },
    session_id,
  });
  const soundToken = jwt.sign({ email: user.email, session_id }, "PRIVATE_KEY_2", {
    expiresIn: 60 * 5,
  });
  return {
    soundToken,
  };
};

const verifyAuthSoundToken = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, "PRIVATE_KEY_2");
  } catch (err) {
    throw boom.badRequest("Invalid Token.");
  }
  const session = await models.Session.findOne({
    session_id: payload.session_id,
  });
  session.metrics.end_time = moment.utc().toISOString();
  await session.save();
  const user = await models.User.findOne({ email: payload.email });
  token = jwt.sign(user.id, "PRIVATE_KEY", {
    expiresIn: constant.TOKEN_EXPIRY,
  });
  return {
    token
  }
};

module.exports = {
  requestOTP,
  validateOTP,
  generateAuthSoundToken,
  verifyAuthSoundToken
};
