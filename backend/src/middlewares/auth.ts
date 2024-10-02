import config from '../config';
import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';

export default async (ctx: Context, next: Next): Promise<void> => {
    const token = ctx.header.authorization?.split(' ')[1];

    if (!token) {
        ctx.throw(401, 'No token provided');
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        ctx.state.user = decoded;
        await next();
    } catch (err) {
        ctx.throw(401, 'Invalid token');
    }
};
