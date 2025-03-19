import { PokemonAbility } from '../../types/pokemon';
import styles from './AbilitiesTab.module.css';

interface AbilitiesTabProps {
    abilities: PokemonAbility[];
    testId?: string;
}

const AbilitiesTab = ({ abilities, testId }: AbilitiesTabProps) => {
    
    const abilitiesElements = abilities.map(ability => (
        <div key={ability.id} className={styles.abilityBlock}>
            <h3 className={styles.abilityName}>{ability.display_name}</h3>
            <p className={styles.abilityDescription}>{ability.description}</p>
        </div>
    ));

    return (
        <div className={styles.abilitiesTabContainer} data-testid={testId}>
            {abilitiesElements}
        </div>
    );
};

export default AbilitiesTab;