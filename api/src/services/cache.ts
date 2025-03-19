import NodeCache from 'node-cache';
import { PokeAPIAbilityResponse, PokeAPIListData, PokeAPIPokemonResponse, PokeAPIProcessedEvolutionChain } from '../types/pokeapi';
import { POKEMON_TTL, POKEMON_LIST_TTL, POKEMON_ABILITY_PREFIX, POKEMON_EVOLUTION_PREFIX, LIST_PREFIX, POKEMON_PREFIX, STANDARD_TTL, CHECK_PERIOD } from '../constants';

/**
 * Singleton cache service for Pokemon data
 * Tracks cache statistics and handles different TTLs for different data types
 */
export class CacheService {
    private static instance: CacheService;
    private cache: NodeCache;
    /**
     * Cache statistics for monitoring and debugging
     * @private
     * @property hits - Number of successful cache retrievals
     * @property misses - Number of cache misses
     * @property errors - Number of cache operation failures
     */
    private readonly stats = {
        hits: 0,
        misses: 0,
        errors: 0
    };

    private constructor() {
        this.cache = new NodeCache({
            stdTTL: STANDARD_TTL,
            checkperiod: CHECK_PERIOD
        });
    }

    public static getInstance() {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const value = this.cache.get<T>(key);
            if (value) {
                this.stats.hits++;
                return value;
            }
            this.stats.misses++;
            return null;
        } catch (error) {
            this.stats.errors++;
            console.error(`Cache get error for key ${key}:`, error);
            return null;
        }
    }

    async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
        try {
            this.cache.set(key, value, ttlSeconds);
        } catch (error) {
            this.stats.errors++;
            console.error(`Cache set error for key ${key}:`, error);
        }
    }

    async invalidate(pattern: string): Promise<void> {
        try {
            const keys = this.cache.keys();
            const matchingKeys = keys.filter(key => key.startsWith(pattern));
            this.cache.del(matchingKeys);
            console.log(`Invalidated ${matchingKeys.length} cache entries for pattern ${pattern}`);
        } catch (error) {
            console.error(`Cache invalidation error for pattern ${pattern}:`, error);
        }
    }

    getStats() {
        return { ...this.stats };
    }

    async getPokemon(name: string): Promise<PokeAPIPokemonResponse | null> {
        return this.get<PokeAPIPokemonResponse>(`${POKEMON_PREFIX}${name}`);
    }

    async setPokemon(id: string, data: PokeAPIPokemonResponse): Promise<void> {
        await this.set<PokeAPIPokemonResponse>(
            `${POKEMON_PREFIX}${id}`,
            data,
            POKEMON_TTL
        );
    }

    async getPokemonAbility(name: string): Promise<PokeAPIAbilityResponse | null> {
        return this.get<PokeAPIAbilityResponse>(`${POKEMON_ABILITY_PREFIX}${name}`);
    }

    async setPokemonAbility(name: string, data: PokeAPIAbilityResponse[]): Promise<void> {
        await this.set<PokeAPIAbilityResponse[]>(
            `${POKEMON_ABILITY_PREFIX}${name}`,
            data,
            POKEMON_TTL
        );
    }

    async getPokemonEvolution(name: string): Promise<PokeAPIProcessedEvolutionChain | null> {
        return this.get<PokeAPIProcessedEvolutionChain>(`${POKEMON_EVOLUTION_PREFIX}${name}`);
    }

    async setPokemonEvolution(name: string, data: PokeAPIProcessedEvolutionChain): Promise<void> {
        await this.set<PokeAPIProcessedEvolutionChain>(
            `${POKEMON_EVOLUTION_PREFIX}${name}`,
            data,
            POKEMON_TTL
        );
    }

    async getPokemonList(limit: number, offset: number): Promise<PokeAPIListData | null> {
        return this.get<PokeAPIListData>(`${LIST_PREFIX}${limit}:${offset}`);
    }

    async setPokemonList(limit: number, offset: number, data: PokeAPIListData): Promise<void> {
        await this.set<PokeAPIListData>(
            `${LIST_PREFIX}${limit}:${offset}`,
            data,
            POKEMON_LIST_TTL
        );
    }
}
