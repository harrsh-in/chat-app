import dotenv from 'dotenv';
dotenv.config();

const getEnv = (
    key: string,
    {
        isOptional = false,
        defaultValue = '',
    }: {
        isOptional?: boolean;
        defaultValue?: string;
    } = {}
): string => {
    const value = process.env[key];
    if (!value) {
        if (isOptional || defaultValue) {
            console.warn(`Environment variable ${key} is missing`);
            return defaultValue || '';
        } else {
            throw new Error(`Environment variable ${key} is missing`);
        }
    }

    return value;
};

export default {
    env: getEnv('NODE_ENV'),
    port: parseInt(
        getEnv('PORT', {
            defaultValue: '8000',
        }),
        10
    ),
    databaseUrl: getEnv('DATABASE_URL'),
    jwtSecret: getEnv('JWT_SECRET'),
    corsOrigin: getEnv('CORS_ORIGIN'),
    rateLimit: {
        windowMs: parseInt(
            getEnv('RATE_LIMIT_DURATION', {
                defaultValue: '60000',
            }),
            10
        ),
        max: parseInt(
            getEnv('RATE_LIMIT_MAX', {
                defaultValue: '100',
            }),
            10
        ),
    },
    bodyLimit: getEnv('BODY_LIMIT', {
        defaultValue: '10mb',
    }),
};
