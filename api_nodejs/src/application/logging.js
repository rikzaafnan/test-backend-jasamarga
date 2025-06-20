import winston from 'winston'

var options = {
    file: {
        level: 'error',
        filename: 'logs/log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // filesize (5MB)
        maxFiles: 5,
        colorize: false,
        format: winston.format.combine(
            winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
                return JSON.stringify({ timestamp, level, message, ...meta });
            })
        ),
    },
    console: {
        level: 'info',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
                let metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
                return `${timestamp} [${level}] ${message} ${metaString}`;
            })
        ),
    },
};
const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false,
});

export {
    logger
}


