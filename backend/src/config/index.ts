import dotenv from 'dotenv';
dotenv.config();

const getEnv = (
    key: string,
    {
        defaultValue,
    }: {
        defaultValue?: string;
    } = {},
) => {
    const value = process.env[key];

    if (!value) {
        if (defaultValue === undefined) {
            throw new Error(`Environment variable ${key} is not set`);
        }

        return defaultValue;
    }

    return value;
};

export const nodeEnv = getEnv('NODE_ENV', {
    defaultValue: 'development',
});
export const isProduction = nodeEnv === 'production';
export const isDevelopment = nodeEnv === 'development';
export const port = getEnv('PORT');
export const corsOrigin = getEnv('CORS_ORIGIN');
export const jwtSecret = getEnv('JWT_SECRET');
