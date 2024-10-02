import logger from '../utils/logger';
import { PrismaClient } from '@prisma/client';

class PrismaInstance {
    private static instance: PrismaClient;

    private constructor() {}

    public static getInstance(): PrismaClient {
        if (!PrismaInstance.instance) {
            PrismaInstance.instance = new PrismaClient();
        }
        return PrismaInstance.instance;
    }
}

export const prisma = PrismaInstance.getInstance();

export const connectDatabase = async (): Promise<void> => {
    try {
        await prisma.$connect();
        logger.info('Connected to the database...');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};
