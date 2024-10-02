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
        if (defaultValue) {
            return defaultValue;
        }
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

export const nodeEnv = getEnv('NODE_ENV', {
    defaultValue: 'development',
});
export const apiBaseUrl =
    getEnv('NEXT_PUBLIC_API_BASE_URL', {
        defaultValue: ' ',
    }) || getEnv('API_BASE_URL');
export const apiPrefix =
    getEnv('NEXT_PUBLIC_API_PREFIX', {
        defaultValue: ' ',
    }) || getEnv('API_PREFIX');
