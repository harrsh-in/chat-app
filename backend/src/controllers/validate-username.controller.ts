import { Context } from 'koa';
import { z } from 'zod';
import HttpError from '../utils/HttpError';
import { prisma } from '../utils/prisma';

const validateUsername = async (ctx: Context) => {
    try {
        const { username } = ctx.request.body as validateUsernameBodyType;

        const existingUser = await prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (existingUser) {
            ctx.body = {
                isUnique: false,
            };
            return;
        }

        ctx.body = {
            isUnique: true,
        };
    } catch (error) {
        throw new HttpError(error);
    }
};

export default validateUsername;

export const validateUsernameBodySchema = z.object({
    username: z.string({
        message: 'Invalid username.',
    }),
});

type validateUsernameBodyType = z.infer<typeof validateUsernameBodySchema>;
