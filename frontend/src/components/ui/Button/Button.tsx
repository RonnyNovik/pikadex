import Loader from '../Loader/Loader';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'icon';
}

const Button = ({ className = '', children, isLoading, variant = 'primary', ...rest }: ButtonProps) => {
    return (
        <button 
            className={`${styles.baseBtn} ${styles[variant]} ${className}`} 
            {...rest}
        >
            {isLoading ? <Loader className={styles.loader} /> : children}
        </button>
    );
};

export default Button;