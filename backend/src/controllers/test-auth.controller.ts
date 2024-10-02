import { Context } from 'koa';

const testAuthController = (ctx: Context) => {
    ctx.body = {
        message: 'This is a protected route',
        user: ctx.state.user,
    };
};

export default testAuthController;
