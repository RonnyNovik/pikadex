import styles from "./Loader.module.css";

interface LoaderProps {
    className?: string;
}

const Loader = ({ className = '' }: LoaderProps) => {

    return (
        <div className={`${styles.loader} ${className}`}></div>
    );
};

export default Loader;