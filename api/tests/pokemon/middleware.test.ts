import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { getPokeAPIBasicData, getPokeAPIEvolutionData } from '../../src/middleware/pokemons';
import { httpClient, getEvolutionChainData } from '../../src/utils';
import { CacheService } from '../../src/services';
import { mockCharmanderData, mockCharmanderEvolutionData, mockCharmanderEvolutionDataResponse, mockCharmanderProcessedData, mockCharmanderSpeciesDataResponse } from './mocks';

vi.mock('../../src/utils', () => {
    class ExternalApiError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'ExternalApiError';
        }
    }

    class RateLimitError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'RateLimitError';
        }
    }

    class NotFoundError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'NotFoundError';
        }
    }

    return {
        httpClient: {
            get: vi.fn()
        },
        extractIdFromUrl: vi.fn().mockReturnValue('2'),
        getEvolutionChainData: vi.fn(),
        ExternalApiError,
        RateLimitError,
        NotFoundError
    };
});

vi.mock('../../src/services', () => ({
    CacheService: {
        getInstance: vi.fn()
    }
}));

describe('Pokemon Middleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let mockCacheService: any;

    beforeEach(() => {
        mockReq = {
            params: { name: 'charmander' }
        };
        mockRes = {
            locals: {},
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        mockNext = vi.fn(() => { }) as unknown as NextFunction;
        mockCacheService = {
            getPokemon: vi.fn(),
            setPokemon: vi.fn(),
            getPokemonEvolution: vi.fn(),
            setPokemonEvolution: vi.fn(),
            getStats: vi.fn().mockReturnValue({ hits: 0, misses: 0, errors: 0 })
        };
        (CacheService.getInstance as any).mockReturnValue(mockCacheService);
        vi.clearAllMocks();
    });

    describe('getPokeAPIBasicData', () => {
        it('should return cached data when available', async () => {
            mockCacheService.getPokemon.mockResolvedValueOnce(mockCharmanderData);

            await getPokeAPIBasicData(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockCacheService.getPokemon).toHaveBeenCalledWith('charmander');
            expect(httpClient.get).not.toHaveBeenCalled();
            expect(mockRes.locals?.pokemonData).toEqual(mockCharmanderData);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should fetch and cache data when not in cache', async () => {

            mockCacheService.getPokemon.mockResolvedValueOnce(null);
            (httpClient.get as any).mockResolvedValueOnce({ data: mockCharmanderData });

            await getPokeAPIBasicData(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockCacheService.getPokemon).toHaveBeenCalledWith('charmander');
            expect(httpClient.get).toHaveBeenCalledWith('/pokemon/charmander');
            expect(mockCacheService.setPokemon).toHaveBeenCalledWith('charmander', mockCharmanderData);
            expect(mockRes.locals?.pokemonData).toEqual(mockCharmanderData);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should handle cache errors gracefully', async () => {
            const cacheError = new Error('Cache service error');
            mockCacheService.getPokemon.mockRejectedValueOnce(cacheError);

            await getPokeAPIBasicData(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Cache service error'
            }));
        });
    });

    describe('getPokeAPIEvolutionData', () => {
        it('should return cached evolution data when available', async () => {

            mockCacheService.getPokemonEvolution.mockResolvedValueOnce(mockCharmanderEvolutionData);

            await getPokeAPIEvolutionData(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockCacheService.getPokemonEvolution).toHaveBeenCalledWith('charmander');
            expect(httpClient.get).not.toHaveBeenCalled();
            expect(mockRes.locals?.evolutionData).toEqual(mockCharmanderEvolutionData);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should fetch and cache evolution data when not in cache', async () => {

            mockCacheService.getPokemonEvolution.mockResolvedValueOnce(null);
            (httpClient.get as any)
                .mockResolvedValueOnce({ data: mockCharmanderSpeciesDataResponse })
                .mockResolvedValueOnce({ data: mockCharmanderEvolutionDataResponse });
            (getEvolutionChainData as any).mockReturnValueOnce(mockCharmanderProcessedData);

            await getPokeAPIEvolutionData(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockCacheService.getPokemonEvolution).toHaveBeenCalledWith('charmander');
            expect(httpClient.get).toHaveBeenCalledTimes(2);
            expect(mockCacheService.setPokemonEvolution).toHaveBeenCalledWith('charmander', mockCharmanderProcessedData);
            expect(mockRes.locals?.evolutionData).toEqual(mockCharmanderProcessedData);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should handle API errors properly', async () => {
            const apiError = new Error('API Error');
            mockCacheService.getPokemonEvolution.mockResolvedValueOnce(null);
            (httpClient.get as any).mockRejectedValueOnce(apiError);

            await getPokeAPIEvolutionData(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Failed to fetch evolution data'
            }));
        });
    });
}); 