import { logHTTP } from '../utils/logger';
import { Context, Next } from 'koa';

export default async (ctx: Context, next: Next): Promise<void> => {
    const start = Date.now();

    await next();

    const ms = Date.now() - start;
    logHTTP(ctx.request, ctx.response, ms);
};
