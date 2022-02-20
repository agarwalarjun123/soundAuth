const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP: {
    NODE_ENV: process.env.NODE_ENV || 'test',
    PORT: process.env.PORT || 3000,
    REQUEST_BODY_SIZE_LIMIT: '50mb',
  },
  LOGGER: {
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    MORGAN_LOG_LEVEL: process.env.MORGAN_LOG_LEVEL || 'combined',
    SILENT_LOGGER: Boolean(process.env.SILENT_LOGGER === 'true'),
  },
  DB: {
    MONGO: {
      URI: process.env.MONGODB_URI,
    }
  },
  API: {},
};

module.exports = config;
