import { NextFunction, Request, Response } from 'express';
import { FavoriteService } from "../services";
import { DEFAULT_LIMIT } from '../constants/pagination';
import { DEFAULT_OFFSET } from '../constants/pagination';

export class FavoriteController {
    private favoriteService: FavoriteService;
    constructor() {
        this.favoriteService = new FavoriteService();
    }

    addFavorite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req;
            const { name } = req.body;
            const { pokemonId } = req.params;
            const intPokemonId = parseInt(pokemonId);
            await this.favoriteService.addFavorite(userId, intPokemonId, name);

            res.status(201).json({ message: 'Favorite added successfully' });
        } catch (error) {
            next(error);
        }
    }

    removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req;
            const { pokemonId } = req.params;
            const intPokemonId = parseInt(pokemonId);
            await this.favoriteService.removeFavorite(userId, intPokemonId);

            res.json({ message: 'Favorite removed successfully' });
        } catch (error) {
            next(error);
        }
    }

    getFavorites = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req;
            const { offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT } = req.query;
            const intOffset = Number(offset);
            const intLimit = Number(limit);
            const favorites = await this.favoriteService.getFavorites(userId, intOffset, intLimit);
            const favoritesPayload = await this.favoriteService.createFavoritesPayload(favorites, intOffset, intLimit);
            res.json(favoritesPayload);
        } catch (error) {
            next(error);
        }
    }
}
