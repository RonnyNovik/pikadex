import { memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { PokemonListItem } from '../../types';
import { PokemonCard } from '../';
import styles from './PokemonList.module.css';

interface PokemonListProps {
    isLoading: boolean;
    hasNextPage: boolean;
    pokemonList: PokemonListItem[];
    fetchNextPage: () => void;
    onSelectPokemon: (name: string | null) => void;
}

const PokemonList = ({ pokemonList, onSelectPokemon, isLoading, fetchNextPage, hasNextPage }: PokemonListProps) => {
    const { ref, inView } = useInView();

    useEffect(() => {
        const shouldFetchNextPage = inView && !isLoading && hasNextPage;
        if (shouldFetchNextPage) {
            fetchNextPage();
        }
    }, [inView, isLoading, hasNextPage, fetchNextPage]);

    const pokemonCardElements = pokemonList.map(pokemon => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} onSelect={onSelectPokemon} />
    ))

    return (
        <div className={styles.pokemonListContainer}>
            {pokemonCardElements}
            <div ref={ref} className={styles.endOfListBlock} />
        </div>
    );
};

export default memo(PokemonList);