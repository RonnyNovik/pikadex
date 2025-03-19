import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { FavoriteController } from '../../src/controllers/favorite';
import { DuplicateError, NotFoundError } from '../../src/utils/errors';
import { mockOneFavorite, mockEmptyPayload } from './mocks';

interface RequestWithUser extends Request {
    userId: string;
}

const mockAddFavorite = vi.fn();
const mockRemoveFavorite = vi.fn();
const mockGetFavorites = vi.fn();
const mockCreateFavoritesPayload = vi.fn();

vi.mock('../../src/services', () => ({
    FavoriteService: vi.fn().mockImplementation(() => ({
        addFavorite: mockAddFavorite,
        removeFavorite: mockRemoveFavorite,
        getFavorites: mockGetFavorites,
        createFavoritesPayload: mockCreateFavoritesPayload
    }))
}));

describe('FavoriteController', () => {
    let controller: FavoriteController;
    let mockReq: Partial<RequestWithUser>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    const TEST_USER_ID = new Types.ObjectId().toString();

    beforeEach(() => {
        controller = new FavoriteController();
        mockReq = {
            body: { name: 'bulbasaur' },
            params: { pokemonId: '1' },
            query: {},
            userId: TEST_USER_ID
        };
        mockRes = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis()
        };
        mockNext = vi.fn() as unknown as NextFunction;
        vi.clearAllMocks();
    });

    describe('addFavorite', () => {
        it('should add favorite and handle errors appropriately', async () => {
            mockAddFavorite.mockResolvedValueOnce({});
            await controller.addFavorite(
                mockReq as RequestWithUser,
                mockRes as Response,
                mockNext
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Favorite added successfully' });

            mockAddFavorite.mockRejectedValueOnce(new DuplicateError('Pokemon already in favorites'));
            await controller.addFavorite(
                mockReq as RequestWithUser,
                mockRes as Response,
                mockNext
            );
            expect(mockNext).toHaveBeenCalledWith(expect.any(DuplicateError));
        });
    });

    describe('getFavorites', () => {
        it('should return favorites with pagination', async () => {


            mockGetFavorites.mockResolvedValueOnce(mockOneFavorite);
            mockCreateFavoritesPayload.mockResolvedValueOnce(mockEmptyPayload);

            await controller.getFavorites(
                mockReq as RequestWithUser,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.json).toHaveBeenCalledWith(mockEmptyPayload);
        });

        it('should handle empty favorites list', async () => {
            mockGetFavorites.mockResolvedValueOnce([]);
            mockCreateFavoritesPayload.mockResolvedValueOnce(mockEmptyPayload);

            await controller.getFavorites(
                mockReq as RequestWithUser,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.json).toHaveBeenCalledWith(mockEmptyPayload);
        });
    });

    describe('removeFavorite', () => {
        it('should remove favorite and handle errors appropriately', async () => {
            mockRemoveFavorite.mockResolvedValueOnce({ deletedCount: 1 });
            await controller.removeFavorite(
                mockReq as RequestWithUser,
                mockRes as Response,
                mockNext
            );
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Favorite removed successfully' });

            mockRemoveFavorite.mockRejectedValueOnce(new NotFoundError('Favorite not found'));
            await controller.removeFavorite(
                mockReq as RequestWithUser,
                mockRes as Response,
                mockNext
            );
            expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
        });
    });
}); 