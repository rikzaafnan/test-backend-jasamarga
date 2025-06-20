// const logstashTransport = require('winston-logstash-transport');
import winston from 'winston'

var options = {
    file: {
        level: 'error',
        filename:'logs/log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, //ukuran file maksimal 5MB
        maxFiles: 5,
        colorize: false,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            winston.format.json(),
            winston.format.printf(({ timestamp, message }) => {
                return `${timestamp} ${message}`;
            })
        ),
    },
    console: {
        level: 'info',
        handleExceptions: true,
        json: true,
        colorize: true,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            winston.format.json(),
            winston.format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level}] ${message}`;
            })
        ),
    },
};

// Panggil class si winston dengan setting yang udah kita buat
var logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // Aplikasi gabakalan berhenti kalo ada exception
});

export {
    logger
}


