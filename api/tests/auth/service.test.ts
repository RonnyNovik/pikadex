import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { AuthService } from '../../src/services';
import { UserModel } from '../../src/models';
import { DuplicateError, ValidationError } from '../../src/utils/errors';
import { expectValidationError } from './utils';

const mockGenerateAccessToken = vi.fn();

vi.mock('../../src/models', () => ({
    UserModel: {
        findOne: vi.fn(),
        create: vi.fn()
    }
}));

vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('hashed-password'),
        compare: vi.fn().mockResolvedValue(true)
    }
}));

vi.mock('../../src/services/token', () => ({
    TokenService: vi.fn().mockImplementation(() => ({
        generateAccessToken: mockGenerateAccessToken
    }))
}));

describe('AuthService', () => {
    let authService: AuthService;
    const mockUserId = new Types.ObjectId().toString();
    const mockAccessToken = 'mock-access-token';
    const validUsername = 'testuser';
    const validPassword = 'TestPass123';
    const hashedPassword = 'hashed-password';

    beforeEach(() => {
        authService = new AuthService();
        vi.clearAllMocks();

        mockGenerateAccessToken.mockReturnValue(mockAccessToken);
    });

    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            (UserModel.findOne as any).mockResolvedValueOnce(null);
            (UserModel.create as any).mockResolvedValueOnce({ _id: mockUserId });

            const result = await authService.createUser(validUsername, validPassword);

            expect(UserModel.findOne).toHaveBeenCalledWith({ username: validUsername });
            expect((bcrypt as any).hash).toHaveBeenCalledWith(validPassword, 10);
            expect(UserModel.create).toHaveBeenCalledWith({
                username: validUsername,
                password_hash: hashedPassword
            });
            expect(mockGenerateAccessToken).toHaveBeenCalledWith(mockUserId);
            expect(result).toEqual({ accessToken: mockAccessToken });
        });

        it('should throw DuplicateError if username already exists', async () => {
            (UserModel.findOne as any).mockResolvedValueOnce({ _id: mockUserId });

            await expect(authService.createUser(validUsername, validPassword))
                .rejects
                .toThrow(DuplicateError);
            expect(UserModel.create).not.toHaveBeenCalled();
        });
    });

    describe('authenticateUser', () => {
        it('should authenticate user successfully', async () => {
            (UserModel.findOne as any).mockResolvedValueOnce({
                _id: mockUserId,
                password_hash: hashedPassword
            });

            const result = await authService.authenticateUser(validUsername, validPassword);

            expect(UserModel.findOne).toHaveBeenCalledWith({ username: validUsername });
            expect((bcrypt as any).compare).toHaveBeenCalledWith(validPassword, hashedPassword);
            expect(mockGenerateAccessToken).toHaveBeenCalledWith(mockUserId);
            expect(result).toEqual({ accessToken: mockAccessToken });
        });

        it('should throw ValidationError if user not found', async () => {
            (UserModel.findOne as any).mockResolvedValueOnce(null);

            await expect(authService.authenticateUser(validUsername, validPassword))
                .rejects
                .toThrow(ValidationError);
            expect((bcrypt as any).compare).not.toHaveBeenCalled();
        });

        it('should throw ValidationError if password is incorrect', async () => {
            (UserModel.findOne as any).mockResolvedValueOnce({
                _id: mockUserId,
                password_hash: hashedPassword
            });
            ((bcrypt as any).compare).mockResolvedValueOnce(false);

            await expect(authService.authenticateUser(validUsername, validPassword))
                .rejects
                .toThrow(ValidationError);
            expect(mockGenerateAccessToken).not.toHaveBeenCalled();
        });
    });

    describe('validateUserInput', () => {
        it('should validate correct username and password', () => {
            expect(() => authService.validateUserInput(validUsername, validPassword))
                .not.toThrow();
        });

        it('should throw ValidationError for short username', () => {
            expectValidationError(() => authService.validateUserInput('ab', validPassword));
        });

        it('should throw ValidationError for long username', () => {
            const longUsername = 'a'.repeat(31);
            expectValidationError(() => authService.validateUserInput(longUsername, validPassword));
        });

        it('should throw ValidationError for short password', () => {
            expectValidationError(() => authService.validateUserInput(validUsername, 'Short1'));
        });

        it('should throw ValidationError for password without uppercase', () => {
            expectValidationError(() => authService.validateUserInput(validUsername, 'testpass123'));
        });

        it('should throw ValidationError for password without lowercase', () => {
            expectValidationError(() => authService.validateUserInput(validUsername, 'TESTPASS123'));
        });

        it('should throw ValidationError for password without number', () => {
            expectValidationError(() => authService.validateUserInput(validUsername, 'TestPassWord'));
        });
    });
});