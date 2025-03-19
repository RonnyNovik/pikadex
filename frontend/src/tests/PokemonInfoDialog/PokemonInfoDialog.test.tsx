import { screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { mockUsePokemonQuery, mockPokemon, renderWithProviders } from '../utils';
import { PokemonInfoDialog } from '../../components';
import { Suspense } from 'react';
import { usePokemonQuery } from '../../hooks';

vi.mock('../../hooks', () => ({
    usePokemonQuery: vi.fn()
}));

describe('PokemonInfoDialog', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(usePokemonQuery).mockImplementation(mockUsePokemonQuery(mockPokemon));
    });

    it('renders pokemon details correctly', async () => {
        renderWithProviders(
            <Suspense fallback={<div>Loading...</div>}>
                <PokemonInfoDialog pokemonName="bulbasaur" onClose={mockOnClose} />
            </Suspense>
        );
        await screen.findByTestId('pokemon-dialog');

        expect(screen.getByTestId('pokemon-dialog')).toBeInTheDocument();
        expect(screen.getByTestId('dialog-fixed-content')).toBeInTheDocument();
        expect(screen.getByTestId('dialog-scroll-content')).toBeInTheDocument();
        expect(screen.getByTestId('pokemon-name')).toHaveTextContent('#1 - bulbasaur');
        expect(screen.getByTestId('pokemon-types')).toBeInTheDocument();
        expect(screen.getByTestId('abilities-tab')).toBeInTheDocument();
        expect(screen.getByTestId('favorite-button')).toBeInTheDocument();
        const img = screen.getByAltText('bulbasaur');
        expect(img).toHaveAttribute('src', expect.stringContaining('bulbasaur.jpg'));
    });

    it('displays ability information', () => {
        renderWithProviders(
            <PokemonInfoDialog pokemonName="bulbasaur" onClose={mockOnClose} />
        );

        expect(screen.getByTestId('abilities-tab')).toBeInTheDocument();
        expect(screen.getByText('Overgrow')).toBeInTheDocument();
        expect(screen.getByText(/Increases the power of Grass-type moves/)).toBeInTheDocument();
    });

    it('displays evolution information', () => {
        renderWithProviders(
            <PokemonInfoDialog pokemonName="bulbasaur" onClose={mockOnClose} />
        );

        fireEvent.click(screen.getByText('Evolutions'));

        expect(screen.getByTestId('evolution-tab')).toBeInTheDocument();
        expect(screen.getByText('ivysaur')).toBeInTheDocument();
        expect(screen.getByText('venusaur')).toBeInTheDocument();
    });

    it('shows loading state while fetching pokemon data', () => {
        vi.mocked(usePokemonQuery).mockImplementation(mockUsePokemonQuery(null, null, true));

        renderWithProviders(
            <PokemonInfoDialog pokemonName="bulbasaur" onClose={mockOnClose} />
        );
        expect(screen.getByTestId('pokemon-dialog')).toHaveTextContent('Fetching pokemon details...');
    });

    it('shows error state when pokemon fetch fails', () => {
        const errorMessage = 'Failed to fetch pokemon';
        vi.mocked(usePokemonQuery).mockImplementation(mockUsePokemonQuery(null, new Error(errorMessage)));

        renderWithProviders(
            <PokemonInfoDialog pokemonName="bulbasaur" onClose={mockOnClose} />
        );
        expect(screen.getByTestId('pokemon-dialog')).toHaveTextContent(errorMessage);
    });
}); 