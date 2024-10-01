import config from '@/config';
import { Request } from 'koa';
import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const level = () => {
    return config.env === 'development' ? 'debug' : 'warn';
};

const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    if (stack) {
        msg += `\n${stack}`;
    }
    return msg;
});

const devTransport = [
    new winston.transports.Console({
        format: combine(
            colorize({
                all: true,
            })
        ),
    }),
];

const prodTransport = [
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({
        filename: 'logs/combined.log',
    }),
    new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
];

const logger = winston.createLogger({
    level: level(),
    levels,
    format: combine(
        errors({
            stack: true,
        }),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss:ms',
        }),
        logFormat
    ),
    transports: config.env === 'development' ? devTransport : prodTransport,
});

export default logger;

const sanitizeData = (data: any): any => {
    const sensitiveFields = ['password', 'token', 'authorization', 'cookie'];
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    return Object.keys(data).reduce((acc: any, key) => {
        if (sensitiveFields.includes(key.toLowerCase())) {
            acc[key] = '[REDACTED]';
        } else if (typeof data[key] === 'object') {
            acc[key] = sanitizeData(data[key]);
        } else {
            acc[key] = data[key];
        }
        return acc;
    }, {});
};

export const logHTTP = (req: Request, res: any, responseTime: number) => {
    const status = res.status;
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers['user-agent'];
    const contentLength = res.get('content-length');

    logger.http(`${method} ${url}`, {
        method,
        url,
        status,
        responseTime: `${responseTime}ms`,
        contentLength,
        userAgent,
        query: sanitizeData(req.query),
        body: sanitizeData(req.body),
    });
};
