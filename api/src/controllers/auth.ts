import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services';

export class AuthController {
    private authService: AuthService;
    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
            const tokenPayload = await this.authService.createUser(username, password);
            res.status(201).json(tokenPayload);
        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
            const tokenPayload = await this.authService.authenticateUser(username, password);
            res.json(tokenPayload);
        } catch (error) {
            next(error);
        }
    }

}