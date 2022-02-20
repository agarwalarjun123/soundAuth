module.exports = {
  LOGGER: {
    LOG_LEVEL: 'debug',
    SILENT_LOGGER: 'true',
    MORGAN_LOG_LEVEL: 'combined',
  },
  APP: {
    IDENTITY_BASE_URL: 'http://localhost:8000/phr_identity',
    PAYRX_BASE_URL: 'http://localhost:8000/payrx',
    THYROCARE_REF_CODE: '1222111',
    PAYRX_KEY: '1222111',
  },
  DB: {
    REDIS: {
      HOST: 'localhost',
      PORT: 6379,
      DB: 0,
    },
  },
};
