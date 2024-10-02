import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import { corsOrigin, nodeEnv } from './config';
import responseMiddleware from './middlewares/responseMiddleware';
import router from './routes';
import winston from './utils/logger';

const app = new Koa();

app.use(helmet());

app.use(
    cors({
        origin: corsOrigin || '*',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        maxAge: 86400,
    }),
);

app.use(compress());

app.use(
    bodyParser({
        enableTypes: ['json'],
        jsonLimit: '5mb',
        strict: true,
        onerror: (err, ctx) => {
            ctx.throw('Invalid JSON', 400);
        },
    }),
);

if (nodeEnv !== 'test') {
    app.use(
        logger((str) => {
            winston.info(str.trim());
        }),
    );
}

app.use(responseMiddleware);

app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err, ctx) => {
    winston.error(`${ctx.method} ${ctx.url} - ${err.message}`, {
        error: err,
        requestDetails: {
            method: ctx.method,
            url: ctx.url,
            headers: ctx.headers,
            body: ctx.request.body,
        },
    });
});

export default app;
