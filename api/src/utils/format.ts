import { extractIdFromUrl } from './url';
import { PokeAPIAbilityName, PokeAPIChainLink, PokeAPIEffectEntry, PokeAPIProcessedEvolutionChain, PokemonEvolution } from '../types';

export const formatName = (name: string): string => {
    return name.split('-').join(' ');
};

/**
 * Transforms raw evolution chain data into a simplified format
 * Handles both linear and branching evolution paths
 * @param chain - Raw evolution chain data from PokeAPI
 * @param currentIndex - Current index of the evolution chain
 * @returns Processed evolution data showing previous and next evolutions
 */
const transformEvolutionNode = (chain: PokeAPIChainLink, currentIndex: number): PokemonEvolution => {
    return {
        id: extractIdFromUrl(chain.species.url),
        name: chain.species.name,
        level: currentIndex
    }
}

/**
 * Processes raw evolution chain data into a simplified format
 * Handles both linear and branching evolution paths
 * @param chain - Raw evolution chain data from PokeAPI
 * @param currentPokemonName - Name of the Pokemon to center the evolution data around
 * @returns Processed evolution data showing previous and next evolutions
 */
export const getEvolutionChainData = (chain: PokeAPIChainLink, currentPokemonName: string): PokeAPIProcessedEvolutionChain => {
    const evolves_from: PokemonEvolution[] = [];
    const evolves_to: PokemonEvolution[] = [];

    let currentEvolution = chain;
    let currentIndex = 0;
    while (currentEvolution.evolves_to.length > 0 && currentEvolution.species.name !== currentPokemonName) {
        evolves_from.push(transformEvolutionNode(currentEvolution, currentIndex));
        currentEvolution = currentEvolution.evolves_to[0];
        currentIndex++;
    }

    let nextEvolution = currentEvolution.evolves_to;
    let nextIndex = 0;
    while (nextEvolution.length > 0) {
        if (nextEvolution.length > 1) {
            evolves_to.push(...nextEvolution.map(evolution => transformEvolutionNode(evolution, nextIndex)));
            break;
        }

        evolves_to.push(transformEvolutionNode(nextEvolution[0], nextIndex));
        nextEvolution = nextEvolution[0].evolves_to;
        nextIndex++;
    }

    return {
        evolves_from,
        evolves_to
    }
}

/**
 * Extracts and formats the description of a Pokemon ability
 * @param effect_entries - Array of effect entries from the ability
 * @returns Formatted description of the ability
 */
export const getAbilityDescription = (effect_entries: PokeAPIEffectEntry[]): string => {
    const entry = effect_entries.find((entry: PokeAPIEffectEntry) => entry.language.name === 'en');
    if (!entry) throw new Error('No English effect entry found');
    return entry.effect;
};

/**
 * Extracts and formats the display name of a Pokemon ability
 * @param names - Array of ability names from the ability
 * @returns Formatted display name of the ability
 */
export const getAbilityDisplayName = (names: PokeAPIAbilityName[]): string => {
    const entry = names.find((name: PokeAPIAbilityName) => name.language.name === 'en');
    if (!entry) throw new Error('No English name found');
    return entry.name;
};


