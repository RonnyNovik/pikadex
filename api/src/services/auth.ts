import { z } from "zod";
import bcrypt from 'bcrypt';
import { UserModel } from "../models";
import { DuplicateError, ValidationError } from "../utils";
import { TokenService } from "./token";

export class AuthService {
    private tokenService: TokenService;
    private readonly SALT_ROUNDS = 10;

    constructor() {
        this.tokenService = new TokenService();
    }

    async createUser(username: string, password: string) {
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            throw new DuplicateError('Username already taken');
        }

        const password_hash = await bcrypt.hash(password, this.SALT_ROUNDS);

        const user = await UserModel.create({ username, password_hash });
        const userId = user._id.toString();
        const accessToken = this.tokenService.generateAccessToken(userId);

        return {
            accessToken
        };
    }

    async authenticateUser(username: string, password: string) {
        const user = await UserModel.findOne({ username });
        if (!user) {
            throw new ValidationError('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new ValidationError('Invalid credentials');
        }

        const userId = user._id.toString();
        const accessToken = this.tokenService.generateAccessToken(userId);
        return {
            accessToken
        }
    }

    validateUserInput(username: string, password: string) {
        const userNameSchema = z.string()
            .min(3, "Username must be at least 3 characters long")
            .max(30, "Username cannot exceed 30 characters")
            
        const passwordSchema = z.string()
            .min(8, "Password must be at least 8 characters long")
            .max(50, "Password cannot exceed 50 characters")
            .regex(/(?=.*[A-Z])(?=.*[a-z])/, "Password must contain at least one uppercase and one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")

        const userSchema = z.object({
            username: userNameSchema,
            password: passwordSchema
        });

        try {
            userSchema.parse({ username, password });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstError = error.errors[0].message
                throw new ValidationError(firstError);
            }
            throw error;
        }
    }
}

