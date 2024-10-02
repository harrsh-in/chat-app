import Router from 'koa-router';
import signUpController, {
    signUpBodySchema,
} from '../controllers/auth/sign-up.controller';
import validateRequestMiddleware from '../middlewares/validate-request.middleware';

const authRouter = new Router();

authRouter.post(
    '/sign-up',
    validateRequestMiddleware({
        body: signUpBodySchema,
    }),
    signUpController,
);

export default authRouter;
