import dayjs from 'dayjs';
import { Context } from 'koa';

const pingController = async (ctx: Context) => {
    const now = dayjs();

    ctx.body = {
        message: 'pong',
        time: {
            human: now.format('YYYY-MM-DD HH:mm:ss'),
        },
    };
    return;
};

export default pingController;
