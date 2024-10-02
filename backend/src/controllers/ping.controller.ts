import { Context } from 'koa';

const pingController = (ctx: Context) => {
    ctx.body = {
        message: 'pong',
    };
};

export default pingController;
