import { Loader } from '../';
import styles from './DialogLoader.module.css';

interface DialogLoaderProps {
    loadingText?: string;
    className?: string;
}

const DialogLoader = ({ loadingText, className = '' }: DialogLoaderProps) => {
    const renderedLoadingText = loadingText || 'Loading...';
    return (
        <div className={`${styles.dialogLoaderContainer} ${className}`}>
            <p className={styles.dialogLoaderText}>{renderedLoadingText}</p>
            <Loader />
        </div>
    );
};

export default DialogLoader;