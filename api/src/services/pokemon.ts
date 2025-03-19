import { PokeAPIListData, PokeAPIProcessedEvolutionChain, PokeAPIAbilityResponse, PokeAPIPokemonResponse, PokeAPITypeSlot, PokeAPINameUrlPayload, PokemonAbility, PaginatedPokemonList, PokemonListItem } from "../types";
import { extractIdFromUrl, getAbilityDescription, getAbilityDisplayName } from "../utils";
import { FavoriteService } from "./favorite";

export class PokemonService {
    private favoriteService: FavoriteService;
    constructor() {
        this.favoriteService = new FavoriteService();
    }

    async isFavorite(userId: string, pokemonId: number) {
        const favorites = await this.favoriteService.getFavorites(userId);
        const isFavorite = favorites.some(favorite => favorite.id === pokemonId);
        return isFavorite;
    }

    /**
     * Creates a standardized Pokemon payload with favorite status
     * Merges Pokemon data with evolution and ability data
     * @param pokemonData - Raw Pokemon data from PokeAPI
     * @param evolutionData - Processed evolution data
     * @param abilityData - Array of ability data
     * @param isFavorite - Boolean indicating if the Pokemon is a favorite
     * @returns Standardized Pokemon payload with favorite status
     */
    async createPokemonPayload(pokemonData: PokeAPIPokemonResponse, evolutionData: PokeAPIProcessedEvolutionChain, abilityData: PokeAPIAbilityResponse[], isFavorite: boolean) {
        const { id, name, types } = pokemonData;
        const { evolves_from, evolves_to } = evolutionData;
        const extractedTypes = types.map((type: PokeAPITypeSlot) => type.type.name);
        const extractedAbilities = abilityData.map((ability: PokeAPIAbilityResponse) => {
            return {
                id: ability.id,
                name: ability.name,
                display_name: getAbilityDisplayName(ability.names),
                description: getAbilityDescription(ability.effect_entries)
            }
        }) as PokemonAbility[];

        const payload = {
            id,
            name,
            types: extractedTypes,
            abilities: extractedAbilities,
            evolves_from,
            evolves_to,
            is_favorite: isFavorite
        }

        return payload;

    }

    async createPokemonListPayload(pokemonListData: PokeAPIListData, userId: string) {
        const { limit, offset, data } = pokemonListData;
        const favorites = await this.favoriteService.getFavorites(userId);
        const pokemonData = data.map((pokemon: PokeAPINameUrlPayload) => {
            return {
                id: extractIdFromUrl(pokemon.url),
                name: pokemon.name,
                is_favorite: favorites.some(favorite => favorite.id === extractIdFromUrl(pokemon.url))
            }
        }) as PokemonListItem[]

        const payload = {
            results: pokemonData,
            limit,
            offset
        } as PaginatedPokemonList

        return payload
    }
}
