import Router from 'koa-router';
import pingController from '../controllers/ping.controller';
import testErrorController from '../controllers/test-error.controller';

const router = new Router({
    prefix: '/api/v1',
});

router.get('/ping', pingController);
router.get('/test-error', testErrorController);

export default router;
