import winston from 'winston';

const logger: winston.Logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        })
    ]
});

export default logger;