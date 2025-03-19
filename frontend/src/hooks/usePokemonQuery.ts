import { useQuery, useInfiniteQuery, UseQueryResult, UseInfiniteQueryResult, InfiniteData, useQueryClient, useMutation, UseMutationResult } from '@tanstack/react-query';
import { Pokemon, PaginatedPokemonList } from '../types';
import { fetchUtil } from '../utils';
import useAuth from './useAuth';

interface UsePokemonQueryReturn {
    getPokemonByName: (name: string) => UseQueryResult<Pokemon, Error>;
    getPokemonList: () => UseInfiniteQueryResult<InfiniteData<PaginatedPokemonList>, Error>;
    getFavoritesList: (enabled: boolean) => UseInfiniteQueryResult<InfiniteData<PaginatedPokemonList>, Error>;
    searchPokemon: (query: string) => UseQueryResult<PaginatedPokemonList, Error>;
    addFavorite: UseMutationResult<void, Error, { pokemonId: number, name: string }>;
    removeFavorite: UseMutationResult<void, Error, { pokemonId: number, name: string }>;
}

export default function usePokemonQuery(): UsePokemonQueryReturn {
    const LIMIT = 150;
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const fetchPokemonByName = (name: string) =>
        fetchUtil<Pokemon>(`/pokemons/by-name/${name}`, {
            token
        });

    const fetchPokemonList = ({ pageParam = 0 }) =>
        fetchUtil<PaginatedPokemonList>(`/pokemons/list?offset=${pageParam}&limit=${LIMIT}`, {
            token
        });

    const fetchFavoritesList = ({ pageParam = 0 }) =>
        fetchUtil<PaginatedPokemonList>(`/favorites/list?offset=${pageParam}&limit=${LIMIT}`, {
            token
        });

    const fetchAddFavorite = ({ pokemonId, name }: { pokemonId: number, name: string }) =>
        fetchUtil<void>(`/favorites/add/${pokemonId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
            token
        });

    const fetchRemoveFavorite = ({ pokemonId }: { pokemonId: number, name: string }) =>
        fetchUtil<void>(`/favorites/remove/${pokemonId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            token
        });

    const fetchSearchPokemon = ({ query }: { query: string }) =>
        fetchUtil<PaginatedPokemonList>(`/pokemons/search?searchQuery=${query}`, {
            token
        });

    const invalidatePokemon = (name: string) => {
        queryClient.invalidateQueries({ queryKey: ['pokemon', name] });
    };

    const invalidatePokemonList = () => {
        queryClient.invalidateQueries({ queryKey: ['pokemonList'] });
        queryClient.invalidateQueries({ queryKey: ['pokemonList', 'favorites'] });
    };
    const getPokemonList = () =>
        useInfiniteQuery({
            queryKey: ['pokemonList'],
            queryFn: fetchPokemonList,
            getNextPageParam: (lastPage) =>
                lastPage.offset + LIMIT,
            initialPageParam: 0,
            enabled: !!token
        });

    const getPokemonByName = (name: string) =>
        useQuery({
            queryKey: ['pokemon', name],
            queryFn: () => fetchPokemonByName(name),
            enabled: !!name && !!token
        });

    const getFavoritesList = (enabled: boolean = false) =>
        useInfiniteQuery({
            queryKey: ['pokemonList', 'favorites'],
            queryFn: fetchFavoritesList,
            getNextPageParam: (lastPage) =>
                lastPage.offset + LIMIT,
            initialPageParam: 0,
            enabled: enabled && !!token
        });

    const searchPokemon = (query: string) =>
        useQuery({
            queryKey: ['pokemonSearch', query],
            queryFn: () => fetchSearchPokemon({ query }),
            enabled: !!query && !!token,
            staleTime: 1000,
        });



    const addFavorite = useMutation({
        mutationFn: fetchAddFavorite,
        onSuccess: (_, { name }) => {
            invalidatePokemon(name);
            invalidatePokemonList();
        }
    });

    const removeFavorite = useMutation({
        mutationFn: fetchRemoveFavorite,
        onSuccess: (_, { name }) => {
            invalidatePokemon(name);
            invalidatePokemonList();
        }
    });

    return {
        getPokemonByName,
        getPokemonList,
        getFavoritesList,
        searchPokemon,
        addFavorite,
        removeFavorite
    };
}; 