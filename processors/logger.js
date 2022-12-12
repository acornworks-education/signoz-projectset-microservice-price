const winston = require('winston');

// Logger configuration
const logConfiguration = {
    transports: [
        new winston.transports.Console()
    ],
    format: (process.env.NODE_ENV || 'local') === 'local' ? 
        winston.format.combine(
            winston.format.label({
                label: 'PriceService'
            }),
            winston.format.timestamp(),
            winston.format.printf((info) => {
                return `${info.timestamp} - ${info.label}:[${info.level}]: ${info.message}`;
            })
        ) : winston.format.json()
};

// Create the logger
module.exports.logger = winston.createLogger(logConfiguration);

