import { Request, Response, NextFunction } from 'express';
import { PokeAPIAbilityResponse } from '../types';
import { createPokeAPIBatches, extractIdFromUrl, handlePokeAPIBatches, httpClient, getEvolutionChainData } from "../utils";
import { CacheService } from '../services';
import { DEFAULT_OFFSET, DEFAULT_LIMIT } from '../constants';
import { checkAndHandleAxiosError, NotFoundError } from '../utils/errors';

/**
 * Interface for response object with Pokemon-specific locals
 * @property locals.pokemonData - Basic Pokemon information
 * @property locals.evolutionData - Pokemon evolution chain
 * @property locals.abilityData - Pokemon abilities
 * @property locals.pokemonList - Paginated list of Pokemon
 */
interface PokemonResponse extends Response {
    locals: {
        pokemonData?: any;
        evolutionData?: any;
        abilityData?: any;
        pokemonList?: any;
    }
}


/**
 * Middleware to fetch and cache Pokemon list data
 * @param req - Express request with optional limit and offset query params
 * @param res - Response object where pokemonList will be stored in locals
 * @param next - Express next function
 */
export const getPokeAPIList = async (req: Request, res: PokemonResponse, next: NextFunction) => {
    const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = req.query;
    const cacheService = CacheService.getInstance();
    const intLimit = Number(limit);
    const intOffset = Number(offset);

    try {
        const cachedPokemonList = await cacheService.getPokemonList(intLimit, intOffset);

        if (cachedPokemonList) {
            res.locals.pokemonList = cachedPokemonList;
            next();
            return;
        }

        const { data } = await httpClient.get(`/pokemon?limit=${limit}&offset=${offset}`);
        const pokemonList = { data: data.results, limit: intLimit, offset: intOffset };

        await cacheService.setPokemonList(intLimit, intOffset, pokemonList);
        res.locals.pokemonList = pokemonList;
        next();
    } catch (error) {
        next(checkAndHandleAxiosError(error, 'Failed to fetch pokemon list'));
    }
};

/**
 * Middleware to fetch and cache basic Pokemon data by name
 * @param req - Express request with pokemon name in params
 * @param res - Response object where pokemonData will be stored in locals
 * @param next - Express next function
 * @throws {NotFoundError} When Pokemon doesn't exist
 * @throws {ExternalApiError} When PokeAPI is unavailable
 */
export const getPokeAPIBasicData = async (req: Request, res: PokemonResponse, next: NextFunction) => {
    const pokemonName = req.params.name;
    const cacheService = CacheService.getInstance();

    try {
        const cachedPokemonData = await cacheService.getPokemon(pokemonName);

        if (cachedPokemonData) {
            res.locals.pokemonData = cachedPokemonData;
            next();
            return;
        }

        const { data } = await httpClient.get(`/pokemon/${pokemonName}`);
        await cacheService.setPokemon(pokemonName, data);
        res.locals.pokemonData = data;
        next();
    } catch (error) {
        next(checkAndHandleAxiosError(error, 'Failed to fetch basic data'));
    }
}

/**
 * Middleware to fetch and cache Pokemon evolution data by name
 * @param req - Express request with pokemon name in params
 * @param res - Response object where evolutionData will be stored in locals
 * @param next - Express next function
 * @throws {ExternalApiError} When PokeAPI is unavailable
 */
export const getPokeAPIEvolutionData = async (req: Request, res: Response, next: NextFunction) => {
    const pokemonName = req.params.name;
    try {
        const cacheService = CacheService.getInstance();
        const cachedEvolutionData = await cacheService.getPokemonEvolution(pokemonName);

        if (cachedEvolutionData) {
            res.locals.evolutionData = cachedEvolutionData;
            next();
            return;
        }

        const { data: speciesData } = await httpClient.get(`/pokemon-species/${pokemonName}`)
        const evolutionChainId = extractIdFromUrl(speciesData.evolution_chain.url);

        const { data: evolutionData } = await httpClient.get(`/evolution-chain/${evolutionChainId}`)
        const evolutionChainData = getEvolutionChainData(evolutionData.chain, pokemonName);

        await cacheService.setPokemonEvolution(pokemonName, evolutionChainData);
        res.locals.evolutionData = evolutionChainData;
        next();
    } catch (error) {
        next(checkAndHandleAxiosError(error, 'Failed to fetch evolution data'));
    }
}

/**
 * Middleware to fetch and cache Pokemon abilities data by name
 * @param req - Express request with pokemon name in params
 * @param res - Response object where abilityData will be stored in locals
 * @param next - Express next function
 * @throws {ExternalApiError} When PokeAPI is unavailable
 */
export const getPokeAPIAbilitiesData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pokemonData = res.locals.pokemonData;

        if (!pokemonData) {
            next(new NotFoundError('Pokemon data not found'));
            return;
        }

        const abilityIds = pokemonData.abilities.map((ability: any) => `/ability/${extractIdFromUrl(ability.ability.url)}`);
        const cacheService = CacheService.getInstance();
        const cachedAbilityData = await cacheService.getPokemonAbility(pokemonData.name);

        if (cachedAbilityData) {
            res.locals.abilityData = cachedAbilityData;
            next();
            return;
        }
        
        const batchRequests = createPokeAPIBatches(abilityIds);
        const abilityData = await handlePokeAPIBatches(batchRequests);

        await cacheService.setPokemonAbility(pokemonData.name, abilityData as PokeAPIAbilityResponse[]);
        res.locals.abilityData = abilityData;
        next();
    } catch (error) {
        next(checkAndHandleAxiosError(error, 'Failed to fetch abilities data'));
    }
}
