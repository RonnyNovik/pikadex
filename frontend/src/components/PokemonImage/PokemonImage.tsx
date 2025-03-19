import { Suspense, useState } from "react";
import PokemonNotFound from "../../assets/pokemon-not-found.png";
import { Loader, LazyImage } from "../ui";
import styles from "./PokemonImage.module.css";

interface PokemonImageProps {
    pokemonName: string;
    className?: string;
    testId?: string;
}

const PokemonImage = ({ pokemonName, className, testId }: PokemonImageProps) => {
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        setHasError(true);
    };

    const imgSrc = hasError ? PokemonNotFound : `https://img.pokemondb.net/artwork/${pokemonName}.jpg`;

    return (
        <>
            <Suspense fallback={<Loader className={styles.loaderContainer} />}>
                <LazyImage
                    src={imgSrc}
                    alt={pokemonName}
                    className={className}
                    onError={handleError}
                    testId={testId}
                />
            </Suspense>
        </>
    );
};

export default PokemonImage;