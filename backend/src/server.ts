import http from 'http';
import app from './app';
import { port, nodeEnv } from './config';
import logger from './utils/logger';
import { connectPrisma, disconnectPrisma } from './utils/prisma';

const server = http.createServer(app.callback());

async function startServer() {
    try {
        await connectPrisma();

        server.listen(port, () => {
            logger.info(
                `Server is running on port ${port} in ${nodeEnv} mode...`,
            );
        });

        server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') {
                throw error;
            }

            switch (error.code) {
                case 'EACCES':
                    logger.error(`Port ${port} requires elevated privileges`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    logger.error(`Port ${port} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

async function shutdownGracefully() {
    logger.info('Shutting down gracefully...');

    server.close(async (err) => {
        if (err) {
            logger.error('Error during server close:', err);
            process.exit(1);
        }

        logger.info('HTTP server closed');

        try {
            await disconnectPrisma();
            logger.info('Database connection closed...');
            process.exit(0);
        } catch (error) {
            logger.error('Error during database disconnection:', error);
            process.exit(1);
        }
    });

    setTimeout(() => {
        logger.error(
            'Could not close connections in time, forcefully shutting down',
        );
        process.exit(1);
    }, 10000);
}

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    shutdownGracefully();
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdownGracefully();
});

process.on('SIGTERM', shutdownGracefully);
process.on('SIGINT', shutdownGracefully);

startServer();
