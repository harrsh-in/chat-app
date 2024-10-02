import { Context } from 'koa';

const testErrorController = (ctx: Context) => {
    ctx.throw(400, 'Test error');
};

export default testErrorController;
