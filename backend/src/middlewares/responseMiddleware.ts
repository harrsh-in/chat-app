import Koa from 'koa';
import { ZodError } from 'zod';
import HttpError from '../utils/HttpError';
import logger from '../utils/logger';

interface RawResponse {
    message: string;
    [key: string]: any;
}

interface FormattedResponse<T = any> {
    status: boolean;
    message: string;
    data: T;
}

const responseMiddleware: Koa.Middleware = async (ctx, next) => {
    try {
        await next();

        if (!ctx.body) return;

        const { message, ...remainingData } = ctx.body as RawResponse;
        const formattedResponse: FormattedResponse = {
            status: true,
            message: message,
            data: remainingData || {},
        };

        ctx.body = formattedResponse;
    } catch (err) {
        let errorResponse: FormattedResponse;
        let statusCode: number = 400;

        if (err instanceof ZodError) {
            logger.error('Validation error:', err.errors);
            errorResponse = {
                status: false,
                message: err.errors[0].message,
                data: {
                    errors: err.errors.map((e) => ({
                        path: e.path.join('.'),
                        message: e.message,
                    })),
                },
            };
        } else if (err instanceof HttpError) {
            logger.error('HTTP error:', err);
            statusCode = err.statusCode;
            errorResponse = {
                status: false,
                message: err.message,
                data: {},
            };
        } else {
            logger.error('Unexpected error:', err);
            statusCode = 500;
            errorResponse = {
                status: false,
                message: 'An unexpected error occurred',
                data: {},
            };
        }

        ctx.status = statusCode;
        ctx.body = errorResponse;

        ctx.app.emit('error', err, ctx);
    }
};

export default responseMiddleware;
