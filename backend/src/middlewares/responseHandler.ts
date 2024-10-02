import config from '../config';
import { ApiResponse, ErrorResponseBody, HttpError, isErrorBody } from '../types/api';
import { Context, Next } from 'koa';

export default async (ctx: Context, next: Next): Promise<void> => {
    try {
        await next();

        if (ctx.body && !isErrorBody(ctx.body)) {
            ctx.body = {
                success: true,
                data: ctx.body,
            } as ApiResponse<typeof ctx.body>;
        }
    } catch (err) {
        const httpError = err as HttpError;
        ctx.status = httpError.status || 500;

        const errorBody: ErrorResponseBody = {
            success: false,
            error: {
                message: httpError.message || 'Internal server error',
                ...(config.env === 'development'
                    ? {
                          stack: httpError.stack,
                      }
                    : {}),
            },
        };

        ctx.body = errorBody;
        ctx.app.emit('error', err, ctx);
    }
};
