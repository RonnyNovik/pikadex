import { PaginatedPokemonList, PokemonListItem } from '../types';

export const extractInfiniteQueryResults = (input: PaginatedPokemonList[] | undefined | null): PokemonListItem[] => {
    if (!input) {
        return [];
    }
    return input.flatMap(page => page.results);
};