import { memo, useMemo } from 'react';
import { usePokemonQuery } from '../../hooks';
import { Pokemon } from '../../types';
import { Dialog, TabsMenu } from '../ui';
import { AbilitiesTab, EvolutionChainTab, PokemonImage, FavoriteButton, PokemonTypeTag } from '../';
import styles from './PokemonInfoDialog.module.css';
import { testIds } from './PokemonInfoDialog.const';

interface PokemonInfoDialogProps {
    pokemonName: string | null;
    onClose: () => void;
}

const INITIAL_POKEMON: Pokemon = {
    id: 0,
    name: '',
    types: [],
    abilities: [],
    evolves_from: [],
    evolves_to: [],
    is_favorite: false,
}

const PokemonInfoDialog = ({ pokemonName, onClose }: PokemonInfoDialogProps) => {
    const { getPokemonByName } = usePokemonQuery();
    const { data: pokemon, isLoading, error } = getPokemonByName(pokemonName ?? '');

    const handleClose = () => {
        onClose();
    };

    const displayName = pokemon ? `#${pokemon.id} - ${pokemon.name}` : '';

    const typeTagElements = pokemon?.types.map((type) => (
        <PokemonTypeTag key={type} type={type} />
    )) ?? [];

    const tabs = useMemo(() => {
        return {
            abilities: {
                label: 'Abilities',
                content: <AbilitiesTab abilities={pokemon?.abilities ?? []} testId={testIds.ABILITIES_TAB} />
            },
            evolution: {
                label: 'Evolutions',
                content: <EvolutionChainTab pokemon={pokemon ?? INITIAL_POKEMON} testId={testIds.EVOLUTION_TAB} />
            }
        };
    }, [pokemon]);

    return (
        <Dialog
            className={styles.dialogContainer}
            isLoading={isLoading}
            loadingText="Fetching pokemon details..."
            hasError={!!error}
            errorMessage={error?.message}
            onClose={handleClose}
            testId={testIds.DIALOG}
        >
            <div className={styles.fixedContent} data-testid={testIds.FIXED_CONTENT}>
                <FavoriteButton
                    className={styles.favoriteButton}
                    isFavorite={pokemon?.is_favorite ?? false}
                    pokemonId={pokemon?.id ?? 0}
                    pokemonName={pokemon?.name ?? ''}
                    testId={testIds.FAVORITE_BUTTON}
                />
                <PokemonImage pokemonName={pokemon?.name ?? ''} className={styles.pokemonImg} data-testid={testIds.POKEMON_IMAGE} />
                <p className={styles.pokemonName} data-testid={testIds.POKEMON_NAME}>{displayName}</p>
                <div className={styles.pokemonTypes} data-testid={testIds.POKEMON_TYPES}>
                    {typeTagElements}
                </div>
            </div>
            <div className={styles.scrollContent} data-testid={testIds.SCROLL_CONTENT}>
                <TabsMenu tabs={tabs} data-testid={testIds.TABS_MENU} />
            </div>
        </Dialog>
    );
};

export default memo(PokemonInfoDialog);