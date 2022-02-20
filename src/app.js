const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const config = require('config');
const HTTP_STATUS_CODES = require('http-status-codes');
require('./util/axios/axios.util');
const healthCheck = require('./util/database/health-check');
const path = require("path")
const app = express();
const logger = require('./util/logger/logger.util');
const setupRoutes = require('./modules');

app.use(logger.successHandler);
app.use(logger.errorHandler);

app.use(helmet());

// set security headers
// cors middleware
app.use(cors());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

//   gzip compression
app.use(compression());

// handle post data
app.use(
  express.json({
    limit: config.APP.REQUEST_BODY_SIZE_LIMIT,
    extended: true,
  })
);
app.use(
  express.urlencoded({
    limit: config.APP.REQUEST_BODY_SIZE_LIMIT,
    extended: true,
  })
);
app.use('/web',express.static(path.join(__dirname,'web')))
// health-check endpoint
app.get('/health-check', healthCheck());
// Register swagger file
// api routes
app.use('/', setupRoutes());
// eslint-disable-next-line no-unused-vars
app.use((data, req, res, _next) => res.json({ data, is_success: true }));
// not found handler
app.use('*', (req, res) =>
  res
    .status(HTTP_STATUS_CODES.NOT_FOUND)
    .json({ error: { message: 'not found' }, is_success: false })
);

module.exports = app;
