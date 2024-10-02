import { Middleware } from 'koa';
import { ZodSchema } from 'zod';

const validateRequestMiddleware = (schemas: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}): Middleware => {
    return async (ctx, next) => {
        if (!schemas.body && !schemas.params && !schemas.query) {
            throw new Error('No schema provided for validation.');
        }

        if (schemas.body) {
            ctx.request.body = schemas.body.parse(ctx.request.body);
        }

        if (schemas.params) {
            ctx.params = schemas.params.parse(ctx.params);
        }

        if (schemas.query) {
            ctx.query = schemas.query.parse(ctx.query);
        }

        await next();
    };
};

export default validateRequestMiddleware;
