export interface ErrorDetails {
    message: string;
    stack?: string;
}

export interface ErrorBody {
    error: ErrorDetails;
}

export interface SuccessBody<T> {
    success: true;
    data: T;
}

export interface ErrorResponseBody {
    success: false;
    error: ErrorDetails;
}

export type ApiResponse<T> = SuccessBody<T> | ErrorResponseBody;

export interface HttpError extends Error {
    status?: number;
}

export function isErrorBody(body: unknown): body is ErrorBody {
    return typeof body === 'object' && body !== null && 'error' in body;
}
