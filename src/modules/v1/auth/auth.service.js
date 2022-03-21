const { v4 } = require("uuid");
const moment = require("moment");
const { generateOTP, hashOTP } = require("./auth.util");
const boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const { sendOTPMessage } = require("../../../util/email/email.util");
const { models } = require("../../../model");
const constant = require("../../../util/constants");
const config = require("config")

const requestOTP = async ({ email }) => {
  const session_id = v4();
  const start_time = moment.utc().toISOString();
  const { otp, hashedOTP } = generateOTP();
  const source = constant.SOURCE.OTP
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
  sendOTPMessage({ otp, email });
  return {
    otp,
    session_id,
  };
};
const validateOTP = async (otp, session_id) => {
  const hashedOTP = hashOTP(otp);
  const session = await models.Session.findOne({ session_id });
  if (!session) {
    throw boom.badRequest("Please request OTP again!");
  }
  if (session.hashedOTP !== hashedOTP) {
    session.metrics.invalid_attempts = session.metrics.invalid_attempts + 1;
    await session.save();
    throw boom.badRequest("Invalid OTP Entered.");
  }
  session.metrics = {
    end_time:moment.utc().toISOString(),
    start_time: session.metrics.start_time
  }
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
  const token = jwt.sign({ id: user.id }, config.APP.TOKEN_KEY, {
    expiresIn: constant.TOKEN_EXPIRY,
  });

  return {
    token,
  };
};

const generateAuthSoundToken = async (id) => {
  const user = await models.User.findById(id);
  const session_id = v4();
  const session = await new models.Session({
    source: constant.SOURCE.SOUND,
    email: user.email,
    metrics: {
      start_time: moment.utc().toISOString(),
    },
    session_id,
  }).save();
  console.log(session)
  const soundToken = jwt.sign(
    { email: user.email, session_id },
    config.APP.SOUND_TOKEN_KEY,
    {
      expiresIn: 60 * 5,
    }
  );
  return {
    soundToken,
  };
};

const verifyAuthSoundToken = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, config.APP.SOUND_TOKEN_KEY);
  } catch (err) {
    throw boom.badRequest("Invalid Token.");
  }
  const session_id = payload.session_id
  const session = await models.Session.findOne({ session_id });
  session.metrics = {
    ...session.metrics,
    end_time: moment.utc().toISOString()
  }
  await session.save();
  const user = await models.User.findOne({ email: payload.email });
  token = jwt.sign({ id: user.id }, "PRIVATE_KEY", {
    expiresIn: constant.TOKEN_EXPIRY,
  });
  return {
    token,
  };
};

const profile = async (id) => {
  return await models.User.findById(id);
};

module.exports = {
  requestOTP,
  validateOTP,
  generateAuthSoundToken,
  verifyAuthSoundToken,
  profile,
};
