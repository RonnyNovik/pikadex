import { PokemonEvolution } from "./pokemon";


export interface PokeAPINameUrlPayload {
    name: string;
    url: string;
}

export interface PokeAPIEvolutionDetail {
    gender: number | null;
    held_item: PokeAPINameUrlPayload | null;
    item: PokeAPINameUrlPayload | null;
    known_move: PokeAPINameUrlPayload | null;
    known_move_type: PokeAPINameUrlPayload | null;
    location: PokeAPINameUrlPayload | null;
    min_affection: number | null;
    min_beauty: number | null;
    min_happiness: number | null;
    min_level: number | null;
    needs_overworld_rain: boolean;
    party_species: PokeAPINameUrlPayload | null;
    party_type: PokeAPINameUrlPayload | null;
    relative_physical_stats: number | null;
    time_of_day: string;
    trade_species: PokeAPINameUrlPayload | null;
    trigger: PokeAPINameUrlPayload;
    turn_upside_down: boolean;
}

export interface PokeAPIChainLink {
    evolution_details: PokeAPIEvolutionDetail[];
    evolves_to: PokeAPIChainLink[];
    is_baby: boolean;
    species: PokeAPINameUrlPayload;
}

export interface PokeAPIEvolutionChain {
    baby_trigger_item: PokeAPINameUrlPayload | null;
    chain: PokeAPIChainLink;
    id: number;
}

export interface PokeAPIVersionGameIndex {
    game_index: number;
    version: PokeAPINameUrlPayload;
}

export interface PokeAPIVersionGroupDetail {
    level_learned_at: number;
    move_learn_method: PokeAPINameUrlPayload;
    version_group: PokeAPINameUrlPayload;
    order: number | null;
}

export interface PokeAPIMoveDetail {
    move: PokeAPINameUrlPayload;
    version_group_details: PokeAPIVersionGroupDetail[];
}

export interface PokeAPIStatDetail {
    base_stat: number;
    effort: number;
    stat: PokeAPINameUrlPayload;
}

export interface PokeAPITypeSlot {
    slot: number;
    type: PokeAPINameUrlPayload;
}

export interface PokeAPIAbilitySlot {
    ability: PokeAPINameUrlPayload;
    is_hidden: boolean;
    slot: number;
}

export interface PokeAPIVersionDetail {
    rarity: number;
    version: PokeAPINameUrlPayload;
}

export interface PokeAPIHeldItem {
    item: PokeAPINameUrlPayload;
    version_details: PokeAPIVersionDetail[];
}

export interface PokeAPISpritesOtherFormats {
    dream_world: {
        front_default: string | null;
        front_female: string | null;
    };
    home: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
    };
    'official-artwork': {
        front_default: string | null;
        front_shiny: string | null;
    };
    showdown: {
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
    };
}

export interface PokeAPIGenerationSprites {
    back_default: string | null;
    back_female?: string | null;
    back_shiny: string | null;
    back_shiny_female?: string | null;
    front_default: string | null;
    front_female?: string | null;
    front_shiny: string | null;
    front_shiny_female?: string | null;
    animated?: {
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
    };
}

export interface PokeAPISprites {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: PokeAPISpritesOtherFormats;
    versions: {
        [version: string]: {
            [game: string]: {
                back_default?: string | null;
                back_female?: string | null;
                back_shiny?: string | null;
                back_shiny_female?: string | null;
                front_default?: string | null;
                front_female?: string | null;
                front_shiny?: string | null;
                front_shiny_female?: string | null;
                animated?: {
                    back_default?: string | null;
                    back_female?: string | null;
                    back_shiny?: string | null;
                    back_shiny_female?: string | null;
                    front_default?: string | null;
                    front_female?: string | null;
                    front_shiny?: string | null;
                    front_shiny_female?: string | null;
                };
                [key: string]: string | null | object | undefined;
            };
        };
    };
}

export interface PokeAPIPokemonResponse {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    weight: number;
    abilities: PokeAPIAbilitySlot[];
    forms: PokeAPINameUrlPayload[];
    game_indices: PokeAPIVersionGameIndex[];
    held_items: PokeAPIHeldItem[];
    is_default: boolean;
    location_area_encounters: string;
    moves: PokeAPIMoveDetail[];
    order: number;
    past_abilities: PokeAPIAbilitySlot[];
    past_types: PokeAPITypeSlot[];
    species: PokeAPINameUrlPayload;
    sprites: PokeAPISprites;
    stats: PokeAPIStatDetail[];
    types: PokeAPITypeSlot[];
    cries: {
        latest: string;
        legacy: string;
    };
}

export interface PokeAPIListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokeAPINameUrlPayload[];
}


export interface PokeAPIEffectEntry {
    effect: string;
    language: PokeAPINameUrlPayload;
    short_effect?: string;
}

export interface PokeAPIFlavorTextEntry {
    flavor_text: string;
    language: PokeAPINameUrlPayload;
    version_group: PokeAPINameUrlPayload;
}

export interface PokeAPIAbilityName {
    language: PokeAPINameUrlPayload;
    name: string;
}

export interface PokeAPIAbilityPokemon {
    is_hidden: boolean;
    pokemon: PokeAPINameUrlPayload;
    slot: number;
}

export interface PokeAPIEffectChange {
    effect_entries: PokeAPIEffectEntry[];
    version_group: PokeAPINameUrlPayload;
}

export interface PokeAPIAbilityResponse {
    id: number;
    name: string;
    is_main_series: boolean;
    generation: PokeAPINameUrlPayload;
    names: PokeAPIAbilityName[];
    effect_entries: PokeAPIEffectEntry[];
    effect_changes: PokeAPIEffectChange[];
    flavor_text_entries: PokeAPIFlavorTextEntry[];
    pokemon: PokeAPIAbilityPokemon[];
}

export interface PokeAPIListData {
    data: PokeAPINameUrlPayload[];
    limit: number;
    offset: number;
}

export interface PokeAPIProcessedEvolutionChain {
    evolves_from: PokemonEvolution[]
    evolves_to: PokemonEvolution[]
} 