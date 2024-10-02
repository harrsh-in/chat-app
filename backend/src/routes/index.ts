import Router from 'koa-router';
import pingController from '../controllers/ping.controller';
import testErrorController from '../controllers/test-error.controller';
import validateUsername, {
    validateUsernameBodySchema,
} from '../controllers/validate-username.controller';
import validateRequestMiddleware from '../middlewares/validate-request.middleware';
import authRouter from './auth.route';

const router = new Router({
    prefix: '/api/v1',
});

router.get('/ping', pingController);
router.get('/test-error', testErrorController);

router.post(
    '/validate-username',
    validateRequestMiddleware({
        body: validateUsernameBodySchema,
    }),
    validateUsername,
);
router.use('/auth', authRouter.routes());

export default router;
