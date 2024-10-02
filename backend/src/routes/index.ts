import pingController from '@/controllers/ping.controller';
import testAuthController from '@/controllers/test-auth.controller';
import testErrorController from '@/controllers/test-error.controller';
import authMiddleware from '@/middlewares/auth';
import Router from '@koa/router';

const router = new Router();

router.get('/', pingController);

router.get('/test-auth', authMiddleware, testAuthController);

router.get('/test-error', testErrorController);

export default router;
