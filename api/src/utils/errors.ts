import { Response } from 'express';
import { ERROR_CODES } from '../constants';
import { AxiosError } from 'axios';


export class AppError extends Error {
    constructor(message: string, public code: number, public id: string) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.id = id;
    }
}

export class RateLimitError extends AppError {
    constructor(message: string) {
        super(message, ERROR_CODES.RATE_LIMIT, 'RATE_LIMIT');
    }
}

export class ExternalApiError extends AppError {
    constructor(message: string) {
        super(message, ERROR_CODES.EXTERNAL_API_ERROR, 'EXTERNAL_API_ERROR');
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, ERROR_CODES.NOT_FOUND, 'NOT_FOUND');
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, ERROR_CODES.VALIDATION_ERROR, 'VALIDATION_ERROR');
    }
}

export class DuplicateError extends AppError {
    constructor(message: string) {
        super(message, ERROR_CODES.DUPLICATE_ERROR, 'DUPLICATE_ERROR');
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, ERROR_CODES.UNAUTHORIZED, 'UNAUTHORIZED');
    }
}

/**
 * Handles errors from Axios requests and cache operations
 * @param error - The error to be handled
 * @param res - Express response object
 * @param defaultMessage - Default error message
 */
export const handleError = (error: any, res: Response, defaultMessage: string) => {
    const apiError = error as AppError;
    const resCode = apiError.code || 500;
    const errorMessage = apiError.message || defaultMessage;

    console.error('Pokemon API Error:', error);
    return res.status(resCode).json({
        error: errorMessage
    });
}


/**
 * Handles errors from Axios requests and cache operations
 * @param error - The error to be handled
 * @param message - Optional custom error message
 * @returns Standardized error object for the middleware
 */
export const checkAndHandleAxiosError = (error: unknown, message?: string): Error => {
    if (error instanceof AxiosError && error.response?.status) {
        switch (error.response?.status) {
            case ERROR_CODES.RATE_LIMIT:
                return new RateLimitError(message || 'Too many requests to external API');
            case ERROR_CODES.NOT_FOUND:
                return new NotFoundError(message || 'Pokemon not found');
            default:
                return new ExternalApiError(message || 'External API service unavailable');
        }
    }

    if (error instanceof Error && error.message.includes('Cache')) {
        return new ExternalApiError('Cache service error');
    }

    return new ExternalApiError(message || 'An unexpected error occurred');
}