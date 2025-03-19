import styles from './PokemonTypeTag.module.css';

interface PokemonTypeTagProps {
    type: string;
}

const PokemonTypeTag = ({ type }: PokemonTypeTagProps) => {
    return (
        <span className={`${styles.tagContainer} ${styles[type]}`}>
            {type}
        </span>
    );
};

export default PokemonTypeTag;