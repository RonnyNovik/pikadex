import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PokemonListItem, Pokemon } from '../types';
import { vi } from 'vitest';
import { usePokemonQuery } from '../hooks';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const mockAuthContext = {
    token: 'test-token',
    isAuthenticated: true,
    onLogin: vi.fn(),
    onLogout: vi.fn(),
};

export const renderWithProviders = (
    ui: React.ReactElement,
    {
        authContext = mockAuthContext,
    } = {}
) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={authContext}>
                <BrowserRouter>{ui}</BrowserRouter>
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};

export const mockUsePokemonQuery = (data?: any, error?: any, loading?: boolean) => {
    return vi.fn().mockReturnValue({
        getPokemonByName: () => ({
            data: loading ? null : data,
            isLoading: loading,
            error: error
        }),
        getPokemonList: () => ({ 
            data: undefined, 
            isLoading: false, 
            error: null 
        }),
        getFavoritesList: () => ({ 
            data: undefined, 
            isLoading: false, 
            error: null 
        }),
        searchPokemon: () => ({ 
            data: undefined, 
            isLoading: false, 
            error: null 
        }),
        addFavorite: {
            isPending: false,
            mutateAsync: vi.fn(),
            data: undefined,
            error: null,
            variables: undefined,
            isError: false,
            isSuccess: false,
            isIdle: true,
            status: 'idle',
            mutate: vi.fn(),
            reset: vi.fn(),
            context: undefined,
            failureCount: 0,
            failureReason: null,
            isPaused: false,
            submittedAt: 0
        },
        removeFavorite: {
            isPending: false,
            mutateAsync: vi.fn(),
            data: undefined,
            error: null,
            variables: undefined,
            isError: false,
            isSuccess: false,
            isIdle: true,
            status: 'idle',
            mutate: vi.fn(),
            reset: vi.fn(),
            context: undefined,
            failureCount: 0,
            failureReason: null,
            isPaused: false,
            submittedAt: 0
        }
    });
};

export const mockPokemonList = [
    { name: 'bulbasaur', id: 1 },
    { name: 'charmander', id: 4 },
    { name: 'squirtle', id: 7 },
    { name: 'pikachu', id: 25 },
    { name: 'jigglypuff', id: 39 },
] as PokemonListItem[];

export const mockPokemon: Pokemon = {
    id: 1,
    name: 'bulbasaur',
    types: ['grass', 'poison'],
    abilities: [
        {
            id: 1,
            name: 'overgrow',
            display_name: 'Overgrow',
            description: 'Increases the power of Grass-type moves by 50% when the Pokémon\'s HP is below 33%.'
        }
    ],
    evolves_from: [],
    evolves_to: [
        { name: 'ivysaur', id: 2, level: 16 },
        { name: 'venusaur', id: 3, level: 32 }
    ],
    is_favorite: false
};

export const mockPokemonWithMultipleEvolutions: Pokemon = {
    id: 4,
    name: 'charmander',
    types: ['fire'],
    abilities: [
        {
            id: 2,
            name: 'blaze',
            display_name: 'Blaze',
            description: 'Increases the power of Fire-type moves by 50% when the Pokémon\'s HP is below 33%.'
        }
    ],
    evolves_from: [],
    evolves_to: [
        { name: 'charmeleon', id: 5, level: 16 },
        { name: 'charizard', id: 6, level: 36 }
    ],
    is_favorite: false
};

export const mockPokemonWithNoEvolutions: Pokemon = {
    id: 25,
    name: 'pikachu',
    types: ['electric'],
    abilities: [
        {
            id: 3,
            name: 'static',
            display_name: 'Static',
            description: 'May paralyze the attacker when hit by a physical move.'
        }
    ],
    evolves_from: [],
    evolves_to: [],
    is_favorite: false
};