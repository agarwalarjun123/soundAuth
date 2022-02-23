
const constant = {
  messages: {
    INTERNAL_SERVER_ERROR: 'Oops something went wrong, please try again!',
  },
  db: {
    MONGO_CONNECT_TIMEOUT: 3000,
    MONGO_SERVER_TIMEOUT: 3000,
  },
  USER_SOURCE: ['OTP','SOUND'],
  SOURCE : {
    OTP: 'OTP',
    SOUND: 'SOUND'
  },
  schema: {
    
    pagination: {
      max_size_limit: 25,
    },
  },
  TOKEN_EXPIRY: 60 * 60
};

module.exports = constant;
