import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services';
import { UnauthorizedError } from '../utils/errors';

/**
 * Middleware to authenticate requests using a Bearer token
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @throws {UnauthorizedError} When token is missing or invalid
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            next(new UnauthorizedError('Access token is required'));
            return;
        }

        const tokenService = new TokenService();
        const { userId } = tokenService.verifyToken(token) as { userId: string };
        req.userId = userId;
        next();
    } catch (error) {
        next(new UnauthorizedError('Invalid or expired token'));
    }
};

