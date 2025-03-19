import { PaginatedPokemonList, PokemonListItem } from '../types';


/**
 * Extracts all Pokemon list items from an array of paginated Pokemon lists
 * @param {PaginatedPokemonList[] | undefined | null} input - The input array of paginated Pokemon lists
 * @returns {PokemonListItem[]} An array of all Pokemon list items
 */
export const extractInfiniteQueryResults = (input: PaginatedPokemonList[] | undefined | null): PokemonListItem[] => {
    if (!input) {
        return [];
    }
    return input.flatMap(page => page.results);
};