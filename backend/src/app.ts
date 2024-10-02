import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import rateLimit from 'koa-ratelimit';
import { v4 as uuidv4 } from 'uuid';
import config from './config';
import httpLogger from './middlewares/httpLogger';
import responseHandler from './middlewares/responseHandler';
import router from './routes';
import logger from './utils/logger';

const app = new Koa();

// Security middleware
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
        referrerPolicy: {
            policy: 'strict-origin-when-cross-origin',
        },
    })
);

app.use(
    cors({
        origin: config.corsOrigin,
        maxAge: 3600,
        credentials: true,
    })
);

// Rate limiting
const rateDb = new Map();
app.use(
    rateLimit({
        driver: 'memory',
        db: rateDb,
        duration: config.rateLimit.windowMs,
        max: config.rateLimit.max,
        errorMessage: 'Too many requests, please try again later.',
        id: (ctx) => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total',
        },
        disableHeader: false,
    })
);

// Parsing and compression
app.use(
    bodyParser({
        enableTypes: ['json', 'form'],
        jsonLimit: config.bodyLimit,
        formLimit: config.bodyLimit,
    })
);
app.use(compress());

// Request ID middleware
app.use(async (ctx, next) => {
    ctx.state.requestId = ctx.get('X-Request-ID') || uuidv4();
    ctx.set('X-Request-ID', ctx.state.requestId);
    await next();
});

// Logging middleware
app.use(async (ctx, next) => {
    ctx.logger = logger.child({
        requestId: ctx.state.requestId,
    });
    await next();
});

// Logging and response handling
app.use(httpLogger);
app.use(responseHandler);

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err, ctx) => {
    ctx.logger.error('Server error', {
        error: err,
        context: ctx,
    });
});

export default app;
