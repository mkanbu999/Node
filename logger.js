const { createLogger, format, transports } = require('winston');

const contactLogger = createLogger({
  transports: [
    new transports.File({
      filename: 'customer.log',
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: 'customer-error.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});
module.exports = { contactLogger };
