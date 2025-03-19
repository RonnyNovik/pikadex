import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { PokemonController } from '../../src/controllers';
import { Pokemon, PaginatedPokemonList, PokeAPIPokemonResponse, PokeAPIProcessedEvolutionChain, PokeAPIAbilityResponse } from '../../src/types';
import { NotFoundError } from '../../src/utils';

interface RequestWithUser extends Request {
    userId: string;
}

interface TestPokemonLocals {
    pokemonData: PokeAPIPokemonResponse;
    evolutionData: PokeAPIProcessedEvolutionChain;
    abilityData: PokeAPIAbilityResponse[];
}

interface TestPokemonListLocals {
    pokemonList: {
        data: any[];
        limit: number;
        offset: number;
    };
}

const mockCreatePokemonPayload = vi.fn();
const mockCreatePokemonListPayload = vi.fn();
const mockIsFavorite = vi.fn();

vi.mock('../../src/services', () => ({
    PokemonService: vi.fn().mockImplementation(() => ({
        createPokemonPayload: mockCreatePokemonPayload,
        createPokemonListPayload: mockCreatePokemonListPayload,
        isFavorite: mockIsFavorite
    }))
}));

describe('PokemonController', () => {
    let controller: PokemonController;
    let mockReq: Partial<RequestWithUser>;
    let mockPokemonRes: Partial<Response<Pokemon | { error: string }, TestPokemonLocals>>;
    let mockListRes: Partial<Response<PaginatedPokemonList | { error: string }, TestPokemonListLocals>>;
    let mockNext: NextFunction;
    const mockUserId = 'test-user-id';

    beforeEach(() => {
        controller = new PokemonController();
        mockReq = {
            userId: mockUserId,
            query: {}
        };
        mockNext = vi.fn() as unknown as NextFunction;
        mockPokemonRes = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis(),
            locals: {
                pokemonData: {
                    id: 1,
                    name: 'bulbasaur',
                    types: [{ type: { name: 'grass' } }]
                } as PokeAPIPokemonResponse,
                evolutionData: {
                    evolves_from: [],
                    evolves_to: []
                },
                abilityData: []
            }
        };
        mockListRes = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis(),
            locals: {
                pokemonList: {
                    data: [
                        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
                        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }
                    ],
                    limit: 10,
                    offset: 0
                }
            }
        };

        vi.clearAllMocks();
    });

    describe('getPokemonData', () => {
        it('should return pokemon data with favorite status', async () => {
            const mockPokemonPayload = {
                id: 1,
                name: 'bulbasaur',
                types: ['grass'],
                abilities: [],
                evolves_from: null,
                evolves_to: [],
                is_favorite: true
            };

            mockIsFavorite.mockResolvedValueOnce(true);
            mockCreatePokemonPayload.mockResolvedValueOnce(mockPokemonPayload);

            await controller.getPokemonData(
                mockReq as RequestWithUser,
                mockPokemonRes as Response<Pokemon | { error: string }, TestPokemonLocals>,
                mockNext
            );

            expect(mockIsFavorite).toHaveBeenCalledWith(mockUserId, 1);
            expect(mockCreatePokemonPayload).toHaveBeenCalledWith(
                mockPokemonRes.locals!.pokemonData,
                mockPokemonRes.locals!.evolutionData,
                mockPokemonRes.locals!.abilityData,
                true
            );
            expect(mockPokemonRes.json).toHaveBeenCalledWith(mockPokemonPayload);
        });

        it('should handle errors by passing them to next', async () => {
            const error = new NotFoundError('Pokemon not found');
            mockIsFavorite.mockRejectedValueOnce(error);

            await controller.getPokemonData(
                mockReq as RequestWithUser,
                mockPokemonRes as Response<Pokemon | { error: string }, TestPokemonLocals>,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getPokemonList', () => {
        it('should return pokemon list with favorite status', async () => {
            const mockListPayload = {
                results: [
                    { id: 1, name: 'bulbasaur', is_favorite: true },
                    { id: 4, name: 'charmander', is_favorite: false }
                ],
                limit: 10,
                offset: 0
            };

            mockCreatePokemonListPayload.mockResolvedValueOnce(mockListPayload);

            await controller.getPokemonList(
                mockReq as RequestWithUser,
                mockListRes as Response<PaginatedPokemonList | { error: string }, TestPokemonListLocals>,
                mockNext
            );

            expect(mockCreatePokemonListPayload).toHaveBeenCalledWith(
                mockListRes.locals!.pokemonList,
                mockUserId
            );
            expect(mockListRes.json).toHaveBeenCalledWith(mockListPayload);
        });

        it('should handle errors by passing them to next', async () => {
            const error = new NotFoundError('Failed to fetch pokemon list');
            mockCreatePokemonListPayload.mockRejectedValueOnce(error);

            await controller.getPokemonList(
                mockReq as RequestWithUser,
                mockListRes as Response<PaginatedPokemonList | { error: string }, TestPokemonListLocals>,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getPokemonListSearch', () => {
        it('should return filtered pokemon list when search query is provided', async () => {
            const searchQuery = 'bulba';
            const mockReqWithSearch = {
                ...mockReq,
                query: { searchQuery }
            };

            const mockListPayload = {
                results: [{ id: 1, name: 'bulbasaur', is_favorite: true }],
                limit: 10,
                offset: 0
            };

            mockCreatePokemonListPayload.mockResolvedValueOnce(mockListPayload);

            await controller.getPokemonListSearch(
                mockReqWithSearch as RequestWithUser,
                mockListRes as Response<PaginatedPokemonList | { error: string }, TestPokemonListLocals>,
                mockNext
            );

            expect(mockCreatePokemonListPayload).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.arrayContaining([
                        expect.objectContaining({ name: 'bulbasaur' })
                    ])
                }),
                mockUserId
            );
            expect(mockListRes.json).toHaveBeenCalledWith(mockListPayload);
        });

        it('should return full list when no search query is provided', async () => {
            const mockListPayload = {
                results: [
                    { id: 1, name: 'bulbasaur', is_favorite: true },
                    { id: 4, name: 'charmander', is_favorite: false }
                ],
                limit: 10,
                offset: 0
            };

            mockCreatePokemonListPayload.mockResolvedValueOnce(mockListPayload);

            await controller.getPokemonListSearch(
                mockReq as RequestWithUser,
                mockListRes as Response<PaginatedPokemonList | { error: string }, TestPokemonListLocals>,
                mockNext
            );

            expect(mockCreatePokemonListPayload).toHaveBeenCalledWith(
                mockListRes.locals!.pokemonList,
                mockUserId
            );
            expect(mockListRes.json).toHaveBeenCalledWith(mockListPayload);
        });
    });
}); 