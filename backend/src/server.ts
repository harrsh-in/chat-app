import http from 'http';
import app from './app';
import config from './config';
import { connectDatabase, prisma } from './utils/database';
import logger from './utils/logger';

let server: http.Server;

const startServer = async () => {
    try {
        await connectDatabase();

        server = http.createServer(app.callback());

        server.listen(config.port);

        server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') {
                throw error;
            }

            switch (error.code) {
                case 'EACCES':
                    logger.error(`Port ${config.port} requires elevated privileges`);
                    process.exit(1);
                case 'EADDRINUSE':
                    logger.error(`Port ${config.port} is already in use`);
                    process.exit(1);
                default:
                    throw error;
            }
        });

        server.on('listening', () => {
            const addr = server.address();
            const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
            logger.info(`Server is listening on ${bind}...`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

const cleanup = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    const shutdownTimeout = setTimeout(() => {
        logger.error('Forcefully shutting down due to timeout');
        process.exit(1);
    }, 30000); // 30 seconds timeout

    try {
        if (server) {
            await new Promise<void>((resolve) => {
                server.close((err) => {
                    if (err) {
                        logger.error('Error closing server:', err);
                    } else {
                        logger.info('Server closed successfully...');
                    }
                    resolve();
                });
            });
        }

        logger.info(`${signal} received. Starting graceful shutdown of the app...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));

        await prisma.$disconnect();
        logger.info('Database connection closed successfully...');

        clearTimeout(shutdownTimeout);
        logger.info('Graceful shutdown completed...');
        process.exit(0);
    } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        clearTimeout(shutdownTimeout);
        process.exit(1);
    }
};

const signalsToHandle = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
signalsToHandle.forEach((signal) => {
    process.on(signal, () => cleanup(signal));
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    cleanup('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    cleanup('unhandledRejection');
});

startServer().catch((err) => {
    logger.error('Error in startServer:', err);
    process.exit(1);
});
