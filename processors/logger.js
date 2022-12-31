const winston = require('winston');
const fs = require('fs');

const getDateStr = () => {
    const currDate = new Date();
    const twoDigit = (num) => (''+ num).padStart(2, '0');
    
    const dateStr = [
        currDate.getUTCFullYear(),
        twoDigit(currDate.getUTCMonth() + 1),
        twoDigit(currDate.getUTCDate())
    ].join('-');

    const timeStr = [
        twoDigit(currDate.getUTCHours()),
        twoDigit(currDate.getUTCMinutes()),
        twoDigit(currDate.getUTCSeconds())
    ].join(':');

    return `${dateStr}T${timeStr}`;
}

const addLogValues = winston.format(info => {
    info['time_str'] = getDateStr();
    info['service_group'] = 'acornworks';

    return info;
});

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
        ) : winston.format.combine(
            addLogValues(),
            winston.format.json()
        )
};

// Create the logger
module.exports.logger = winston.createLogger(logConfiguration);

