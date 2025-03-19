export interface PokemonEvolution {
    id: number;
    name: string;
    level: number;
}


export interface PokemonAbility {
    id: number;
    name: string;
    display_name: string;
    description: string;
}

export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    is_favorite: boolean;
    abilities: PokemonAbility[];
    evolves_from: PokemonEvolution[];
    evolves_to: PokemonEvolution[];
}



export interface PokemonListItem {
    id: number;
    name: string;
    is_favorite: boolean;
}

export interface PaginatedPokemonList {
    results: PokemonListItem[];
    limit: number;
    offset: number;
} 