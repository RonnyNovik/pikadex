import express from 'express';
import { PokemonController } from '../controllers';
import { getPokeAPIAbilitiesData, getPokeAPIBasicData, getPokeAPIEvolutionData, getPokeAPIList } from '../middleware'
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

const {
    getPokemonList,
    getPokemonListSearch,
    getPokemonData
} = new PokemonController();

router.use(authMiddleware);
router.get('/list', getPokeAPIList, getPokemonList);
router.get('/search', getPokeAPIList, getPokemonListSearch);
router.get('/by-name/:name', getPokeAPIBasicData, getPokeAPIEvolutionData, getPokeAPIAbilitiesData, getPokemonData)

export default router;