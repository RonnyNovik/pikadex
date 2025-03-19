import { screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProviders, mockPokemonList } from '../utils';
import PokemonList from '../../components/PokemonList/PokemonList';

describe('PokemonList', () => {
    const mockOnSelectPokemon = vi.fn();
    const mockFetchNextPage = vi.fn();

    it('renders pokemon list correctly', () => {
        renderWithProviders(
            <PokemonList
                pokemonList={mockPokemonList}
                onSelectPokemon={mockOnSelectPokemon}
                isLoading={false}
                hasNextPage={false}
                fetchNextPage={mockFetchNextPage}
            />
        );

        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
        expect(screen.getByText('charmander')).toBeInTheDocument();
        expect(screen.getByText('squirtle')).toBeInTheDocument();
        expect(screen.getByText('pikachu')).toBeInTheDocument();
        expect(screen.getByText('jigglypuff')).toBeInTheDocument();
    });

    it('calls onSelectPokemon when clicking a pokemon', () => {
        renderWithProviders(
            <PokemonList
                pokemonList={mockPokemonList}
                onSelectPokemon={mockOnSelectPokemon}
                isLoading={false}
                hasNextPage={false}
                fetchNextPage={mockFetchNextPage}
            />
        );

        fireEvent.click(screen.getByText('bulbasaur'));
        expect(mockOnSelectPokemon).toHaveBeenCalledWith('bulbasaur');
    });
});