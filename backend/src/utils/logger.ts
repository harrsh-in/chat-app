import path from 'path';
import winston from 'winston';
import { isDevelopment, isProduction } from '../config';

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'white',
    silly: 'gray',
};

winston.addColors(colors);

const formatWithMetadata = winston.format.printf(
    ({ timestamp, level, message, ...metadata }) => {
        let metadataStr = JSON.stringify(metadata);
        if (metadataStr !== '{}') {
            return `${timestamp} ${level}: ${message} - ${metadataStr}`;
        }
        return `${timestamp} ${level}: ${message}`;
    },
);

const customFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({
        stack: true,
    }),
    winston.format.splat(),
    winston.format.json(),
    formatWithMetadata,
);

const consoleFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.colorize({
        all: true,
    }),
    formatWithMetadata,
);

const prodTransport = [
    new winston.transports.File({
        filename: path.join(__dirname, '../../logs/error.log'),
        level: 'error',
    }),
    new winston.transports.File({
        filename: path.join(__dirname, '../../logs/combined.log'),
    }),
];

const transports: winston.transport[] = [
    new winston.transports.Console({
        format: consoleFormat,
    }),
];

if (isProduction) {
    transports.push(...prodTransport);
}

const logger = winston.createLogger({
    level: isDevelopment ? 'debug' : 'warn',
    format: customFormat,
    transports,
});

export default logger;
