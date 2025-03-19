import { PokeAPIChainLink } from "../../src/types";

export const mockCharmanderChain: PokeAPIChainLink = {
    evolution_details: [],
    evolves_to: [{
        evolution_details: [],
        evolves_to: [{
            evolution_details: [],
            evolves_to: [],
            is_baby: false,
            species: {
                name: "charizard",
                url: "https://pokeapi.co/api/v2/pokemon-species/6/"
            }
        }],
        is_baby: false,
        species: {
            name: "charmeleon",
            url: "https://pokeapi.co/api/v2/pokemon-species/5/"
        }
    }],
    is_baby: false,
    species: {
        name: "charmander",
        url: "https://pokeapi.co/api/v2/pokemon-species/4/"
    }
};

export const mockCharmanderData = {
    id: 4,
    name: 'charmander',
    types: [{ type: { name: 'fire' } }]
}

export const mockCharmanderEvolutionData = {
    evolves_from: null,
    evolves_to: [{
        name: 'charmeleon',
        evolves_to: [{ name: 'charizard', evolves_to: [] }]
    }]
}

export const mockCharmanderSpeciesDataResponse = {
    evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/2/' }
};

export const mockCharmanderEvolutionDataResponse = {
    chain: {
        species: { name: 'charmander' },
        evolves_to: [{
            species: { name: 'charmeleon' },
            evolves_to: [{
                species: { name: 'charizard' },
                evolves_to: []
            }]
        }]
    }
};

export const mockCharmanderProcessedData = {
    evolves_from: null,
    evolves_to: [{
        name: 'charmeleon',
        evolves_to: [{
            name: 'charizard',
            evolves_to: []
        }]
    }]
};

export const mockEeveeChain: PokeAPIChainLink = {
    evolution_details: [],
    evolves_to: [
        {
            evolution_details: [],
            evolves_to: [],
            is_baby: false,
            species: { name: "vaporeon", url: "https://pokeapi.co/api/v2/pokemon-species/134/" }
        },
        {
            evolution_details: [],
            evolves_to: [],
            is_baby: false,
            species: { name: "jolteon", url: "https://pokeapi.co/api/v2/pokemon-species/135/" }
        },
        {
            evolution_details: [],
            evolves_to: [],
            is_baby: false,
            species: { name: "flareon", url: "https://pokeapi.co/api/v2/pokemon-species/136/" }
        }
    ],
    is_baby: false,
    species: { name: "eevee", url: "https://pokeapi.co/api/v2/pokemon-species/133/" }
};

