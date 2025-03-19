import { NextFunction, Request, Response } from 'express';
import { PokemonService } from '../services';
import { Pokemon, PaginatedPokemonList, PokeAPIAbilityResponse, PokeAPIProcessedEvolutionChain, PokeAPIListData, PokeAPIPokemonResponse } from '../types';


interface PokemonLocals {
    pokemonData: PokeAPIPokemonResponse;
    evolutionData: PokeAPIProcessedEvolutionChain;
    abilityData: PokeAPIAbilityResponse[];
}

interface PokemonListLocals {
    pokemonList: PokeAPIListData;
}

export class PokemonController {
    private pokemonService: PokemonService;

    constructor() {
        this.pokemonService = new PokemonService();
    }

    getPokemonList = async (
        req: Request,
        res: Response<PaginatedPokemonList | { error: string }, PokemonListLocals>,
        next: NextFunction
    ) => {
        try {
            const { userId } = req;
            const pokemonListData = res.locals.pokemonList;
            const pokemonListPayload = await this.pokemonService.createPokemonListPayload(pokemonListData, userId);

            res.json(pokemonListPayload);
        } catch (error) {
            next(error)
        }
    }

    getPokemonListSearch = async (
        req: Request,
        res: Response<PaginatedPokemonList | { error: string }, PokemonListLocals>,
        next: NextFunction
    ) => {
        const { searchQuery } = req.query;
        try {
            const { userId } = req;
            const pokemonListData = res.locals.pokemonList;
            if (!searchQuery) {
                const pokemonListPayload = await this.pokemonService.createPokemonListPayload(pokemonListData, userId);
                res.json(pokemonListPayload);
                return;
            }

            const formattedSearchQuery = (searchQuery as string).toLowerCase().trim();
            const filteredData = pokemonListData.data.filter(pokemon =>
                pokemon.name.toLowerCase().startsWith(formattedSearchQuery)
            );

            const filteredPokemonListData = {
                ...pokemonListData,
                data: filteredData
            };

            const pokemonListPayload = await this.pokemonService.createPokemonListPayload(filteredPokemonListData, userId);
            res.json(pokemonListPayload);
        } catch (error) {
            next(error);
        }
    }

    getPokemonData = async (
        req: Request,
        res: Response<Pokemon | { error: string }, PokemonLocals>,
        next: NextFunction
    ) => {
        try {
            const { pokemonData, evolutionData, abilityData } = res.locals;
            const { userId } = req;
            const isFavorite = await this.pokemonService.isFavorite(userId, pokemonData.id);
            const pokemonDataPayload = await this.pokemonService.createPokemonPayload(pokemonData, evolutionData, abilityData, isFavorite);

            res.json(pokemonDataPayload);
        } catch (error) {
            next(error)
        }
    }
}
