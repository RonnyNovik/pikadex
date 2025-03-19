import { DeleteResult } from 'mongoose';
import { FavoriteModel } from '../models';
import { DuplicateError, NotFoundError } from '../utils/errors';
import { Favorite } from '../types';

export class FavoriteService {
    async addFavorite(userId: string, pokemonId: number, name: string) {
        const existing = await FavoriteModel.findOne({ userId, pokemonId });
        if (existing) {
            throw new DuplicateError('Pokemon already in favorites');
        }

        return FavoriteModel.create({
            userId,
            pokemonId,
            name,
        });
    }

    async removeFavorite(userId: string, pokemonId: number): Promise<DeleteResult> {
        const result = await FavoriteModel.deleteOne({ userId, pokemonId });
        if (result.deletedCount === 0) {
            throw new NotFoundError('Favorite not found');
        }
        return result;
    }

    async getFavorites(userId: string, offset: number = 0, limit: number = 10000) {
        const favorites = await FavoriteModel.find({ userId })
            .sort({ pokemonId: 1 })
            .skip(offset)
            .limit(limit);

        return favorites.map(doc => ({
            id: doc.pokemonId,
            name: doc.name,
            is_favorite: true,
        }));
    }

    async createFavoritesPayload(favorites: Favorite[], offset: number, limit: number) {
        return {
            results: favorites,
            pagination: {
                offset,
                limit,
            }
        }
    }
} 