import { useMemo } from 'react';
import { ArrowDown } from 'lucide-react';
import { Pokemon } from '../../types';
import { PokemonCard } from '../';
import styles from './EvolutionChainTab.module.css';

interface EvolutionChainTabProps {
    pokemon: Pokemon;
    testId?: string;
}

const EvolutionChainTab = ({ pokemon, testId }: EvolutionChainTabProps) => {
    const { evolves_from, evolves_to } = pokemon;

    const evolvesFromElements = useMemo(() => evolves_from.map((evolution) => (
        <div key={evolution.id} className={styles.evolutionStep}>
            <PokemonCard pokemon={evolution} />
            <ArrowDown className={styles.arrow} />
        </div>
    )), [evolves_from]);

    const evolvesToElements = useMemo(() => evolves_to.map((evolution, index) => {
        const isOr = evolution.level === evolves_to[index + 1]?.level;
        const isLast = evolves_to.length === index + 1;
        return (
            <div key={evolution.id} className={styles.evolutionStep}>
                <PokemonCard pokemon={evolution} />
                {isOr && <span className={styles.orIndicator}>OR</span>}
                {!isOr && !isLast && <ArrowDown className={styles.arrow} />}
            </div>
        );
    }), [evolves_to]);

    const hasEvolutions = evolvesFromElements.length > 0 || evolvesToElements.length > 0;

    const currentPokemonElement =
        <div className={styles.evolutionStep}>
            <PokemonCard pokemon={pokemon} />
            {evolvesToElements.length > 0 && <ArrowDown className={styles.arrow} />}
        </div>

    const renderEvolutionChain = () => {
        if (!hasEvolutions) {
            return <p className={styles.noEvolutions}>This Pokemon has no evolutions</p>;
        }

        return (
            <div className={styles.evolutionChain}>
                {evolvesFromElements}
                {currentPokemonElement}
                {evolvesToElements}
            </div>
        );
    };

    return (
        <div className={styles.evolutionChainContainer} data-testid={testId}>
            {renderEvolutionChain()}
        </div>
    );
};

export default EvolutionChainTab;