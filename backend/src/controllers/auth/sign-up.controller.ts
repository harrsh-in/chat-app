import { Context } from 'koa';
import { z } from 'zod';
import HttpError from '../../utils/HttpError';
import { hashValue } from '../../utils/manage-encryption';
import { prisma } from '../../utils/prisma';

const signUpController = async (ctx: Context) => {
    try {
        const body = ctx.request.body as signUpBodyType;

        const existingUser = await prisma.user.findUnique({
            where: {
                username: body.username,
            },
        });
        if (existingUser) {
            throw new HttpError('User already exists.');
        }

        const hashedPassword = await hashValue({
            text: body.password,
        });

        await prisma.user.create({
            data: {
                username: body.username,
                hashed_password: hashedPassword,
                public_key: body.publicKey,
                encrypted_private_key: body.privateKey,
            },
        });

        ctx.status = 201;
        ctx.body = {};
    } catch (error) {
        throw new HttpError(error);
    }
};

export default signUpController;

export const signUpBodySchema = z
    .object({
        username: z.string({
            message: 'Invalid username.',
        }),
        password: z
            .string({
                message: 'Password must be at least 8 characters long.',
            })
            .min(8, {
                message: 'Password must be at least 8 characters long.',
            }),
        confirmPassword: z.string({
            message: 'Passwords do not match.',
        }),
        publicKey: z.string({
            message: 'Invalid public key.',
        }),
        privateKey: z.string({
            message: 'Invalid private key.',
        }),
    })
    .superRefine((data) => {
        if (data.password !== data.confirmPassword) {
            return {
                message: 'Passwords do not match.',
            };
        }
    });

type signUpBodyType = z.infer<typeof signUpBodySchema>;
