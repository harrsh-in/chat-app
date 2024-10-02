class HttpError extends Error {
    statusCode: number;

    constructor(error: unknown, statusCode: number = 400) {
        let message: string;

        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        } else {
            message = 'An unknown error occurred.';
        }
        super(message);
        this.statusCode = statusCode;
    }
}

export default HttpError;
