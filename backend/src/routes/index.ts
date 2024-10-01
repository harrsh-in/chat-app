import authMiddleware from '@/middlewares/auth';
import Router from '@koa/router';

const router = new Router();

router.get('/', (ctx) => {
    ctx.body = {
        message: 'Welcome to the API',
    };
});

router.get('/protected', authMiddleware, (ctx) => {
    ctx.body = {
        message: 'This is a protected route',
        user: ctx.state.user,
    };
});

router.get('/error-test', (ctx) => {
    ctx.throw(401, 'Test error');
});

export default router;
