import { memo, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { Pokemon } from '../../types';
import { Card } from '../ui';
import { PokemonImage } from '../';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
    pokemon: Pick<Pokemon, 'id' | 'name'> & {
        is_favorite?: boolean;
    };
    onSelect?: (name: string) => void;
}

const PokemonCard = ({ pokemon, onSelect }: PokemonCardProps) => {

    const handlePokemonSelect = useCallback(() => {
        onSelect?.(pokemon.name);
    }, [onSelect, pokemon.name]);


    const idText = `#${pokemon.id.toString().padStart(3, '0')}`;
    return (
        <Card onClick={handlePokemonSelect}>
            {pokemon.is_favorite && (
                <div className={styles.favoriteContainer}>
                    <Heart className={styles.favoriteIcon} />
                </div>
            )}
            <PokemonImage pokemonName={pokemon.name} className={styles.image} />
            <div className={styles.info}>
                <h3 className={styles.name}>{pokemon.name}</h3>
                <p className={styles.number}>{idText}</p>
            </div>
        </Card>
    );
};

export default memo(PokemonCard);