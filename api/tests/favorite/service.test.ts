import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FavoriteService } from '../../src/services';
import { FavoriteModel } from '../../src/models';
import { DuplicateError, NotFoundError } from '../../src/utils/errors';
import { Types } from 'mongoose';
import { mockTwoFavorites, mockTwoFavoritesWithIsFavorite } from './mocks';

vi.mock('../../src/models', () => ({
    FavoriteModel: {
        findOne: vi.fn(),
        create: vi.fn(),
        deleteOne: vi.fn(),
        find: vi.fn(),
        countDocuments: vi.fn()
    }
}));

describe('FavoriteService', () => {
    let favoriteService: FavoriteService;
    const mockUserId = new Types.ObjectId().toString();
    const mockPokemonId = 1;
    const mockPokemonName = 'Bulbasaur';

    beforeEach(() => {
        favoriteService = new FavoriteService();
        vi.clearAllMocks();
    });

    describe('addFavorite', () => {
        it('should add a favorite and prevent duplicates', async () => {
            (FavoriteModel.findOne as any).mockResolvedValueOnce(null);
            (FavoriteModel.create as any).mockResolvedValueOnce({
                userId: mockUserId,
                pokemonId: mockPokemonId,
                name: mockPokemonName
            });

            const result = await favoriteService.addFavorite(mockUserId, mockPokemonId, mockPokemonName);
            expect(result).toBeDefined();
            expect(FavoriteModel.create).toHaveBeenCalledWith({
                userId: mockUserId,
                pokemonId: mockPokemonId,
                name: mockPokemonName
            });

            (FavoriteModel.findOne as any).mockResolvedValueOnce({ pokemonId: mockPokemonId });
            await expect(favoriteService.addFavorite(mockUserId, mockPokemonId, mockPokemonName))
                .rejects
                .toThrow(DuplicateError);
        });
    });

    describe('getFavorites', () => {
        it('should return favorites with correct transformation', async () => {
            (FavoriteModel.find as any).mockReturnValue({
                sort: () => ({
                    skip: () => ({
                        limit: () => Promise.resolve(mockTwoFavorites)
                    })
                })
            });

            const result = await favoriteService.getFavorites(mockUserId);

            expect(result).toEqual(mockTwoFavoritesWithIsFavorite);
        });

        it('should handle empty favorites list', async () => {
            (FavoriteModel.find as any).mockReturnValue({
                sort: () => ({
                    skip: () => ({
                        limit: () => Promise.resolve([])
                    })
                })
            });

            const result = await favoriteService.getFavorites(mockUserId);
            expect(result).toEqual([]);
        });
    });

    describe('removeFavorite', () => {
        it('should remove favorite and handle non-existent cases', async () => {
            (FavoriteModel.deleteOne as any).mockResolvedValueOnce({ deletedCount: 1 });
            const result = await favoriteService.removeFavorite(mockUserId, mockPokemonId);
            expect(result.deletedCount).toBe(1);

            (FavoriteModel.deleteOne as any).mockResolvedValueOnce({ deletedCount: 0 });
            await expect(favoriteService.removeFavorite(mockUserId, mockPokemonId))
                .rejects
                .toThrow(NotFoundError);
        });
    });
});

