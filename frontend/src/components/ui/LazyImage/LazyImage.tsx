import { useState } from "react";
import { Loader } from "../";
import styles from "./LazyImage.module.css";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    testId?: string;
}

const LazyImage = ({ src, alt, className = '', onError, testId, ...rest }: LazyImageProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <>
            {isLoading && <Loader className={styles.loaderContainer} />}
            <img
                {...rest}
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={handleLoad}
                onError={onError}
                className={className}
                data-testid={testId}
            />
        </>
    );
};

export default LazyImage;