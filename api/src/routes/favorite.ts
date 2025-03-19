import express from 'express';
import { FavoriteController } from '../controllers';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const {
    getFavorites,
    addFavorite,
    removeFavorite
} = new FavoriteController();


router.use(authMiddleware);
router.get('/list', getFavorites);
router.post('/add/:pokemonId', addFavorite);
router.delete('/remove/:pokemonId', removeFavorite);

export default router;