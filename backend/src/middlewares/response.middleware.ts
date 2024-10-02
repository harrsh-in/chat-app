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
    } catch (error) {
        let errorResponse: FormattedResponse;
        let statusCode: number = 400;

        if (error instanceof ZodError) {
            logger.error('Validation error:', error.errors);
            errorResponse = {
                status: false,
                message: error.errors[0].message,
                data: {
                    errors: error.errors.map((e) => ({
                        path: e.path.join('.'),
                        message: e.message,
                    })),
                },
            };
        } else if (error instanceof HttpError) {
            logger.error('HTTP error:', error);
            statusCode = error.statusCode;
            errorResponse = {
                status: false,
                message: error.message,
                data: {},
            };
        } else {
            logger.error('Unexpected error:', error);
            statusCode = 500;
            errorResponse = {
                status: false,
                message: 'An unexpected error occurred',
                data: {},
            };
        }

        ctx.status = statusCode;
        ctx.body = errorResponse;

        ctx.app.emit('error', error, ctx);
    }
};

export default responseMiddleware;
