import { Heart } from 'lucide-react';
import { usePokemonQuery } from '../../hooks';
import { Button } from '../ui';
import styles from './FavoriteButton.module.css';

interface FavoriteButtonProps {
    isFavorite: boolean;
    className?: string;
    pokemonId: number;
    pokemonName: string;
    testId?: string;
}

const FavoriteButton = ({ isFavorite, className, pokemonId, pokemonName, testId }: FavoriteButtonProps) => {
    const { addFavorite, removeFavorite } = usePokemonQuery();

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (isFavorite) {
                await removeFavorite.mutateAsync({ pokemonId, name: pokemonName });
            } else {
                await addFavorite.mutateAsync({ pokemonId, name: pokemonName });
            }
        } catch (error) {
            console.error('Error adding/removing favorite:', error);
        }
    };

    return (
        <Button
            variant='icon'
            onClick={handleClick}
            className={`${styles.favoriteButton} ${className}`}
            disabled={addFavorite.isPending || removeFavorite.isPending}
            data-testid={testId}
        >
            {isFavorite ? <Heart className={styles.heartFilled} /> : <Heart className={styles.heart} />}
        </Button>
    );
};

export default FavoriteButton;