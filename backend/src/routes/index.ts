import Router from 'koa-router';
import pingController from '../controllers/ping.controller';
import testErrorController from '../controllers/test-error.controller';
import authRouter from './auth.route';

const router = new Router({
    prefix: '/api/v1',
});

router.get('/ping', pingController);
router.get('/test-error', testErrorController);

router.use('/auth', authRouter.routes());

export default router;
