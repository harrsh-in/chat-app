import { PrismaClient } from '@prisma/client';
import logger from './logger';

class PrismaInstance {
    private static instance: PrismaInstance;
    private _prisma: PrismaClient;

    private constructor() {
        this._prisma = new PrismaClient();
    }

    public static getInstance(): PrismaInstance {
        if (!PrismaInstance.instance) {
            PrismaInstance.instance = new PrismaInstance();
        }
        return PrismaInstance.instance;
    }

    public get prisma(): PrismaClient {
        return this._prisma;
    }

    public async connect(): Promise<void> {
        try {
            await this._prisma.$connect();
            logger.info('Successfully connected to the database...');
        } catch (error) {
            logger.error('Failed to connect to the database', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this._prisma.$disconnect();
            logger.info('Successfully disconnected from the database...');
        } catch (error) {
            logger.error('Failed to disconnect from the database', error);
            throw error;
        }
    }
}

export const prisma = PrismaInstance.getInstance().prisma;

export const connectPrisma = () => PrismaInstance.getInstance().connect();
export const disconnectPrisma = () => PrismaInstance.getInstance().disconnect();
