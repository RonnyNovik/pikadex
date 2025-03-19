import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    label?: string;
    description?: string;
    onClear?: () => void;
}

const Input = ({ className = '', label, onClear, description, ...rest }: InputProps) => {
    return (
        <div className={`${styles.wrapper} ${className}`}>
            {label && <label className={styles.inputLabel} htmlFor={rest.id}>{label}</label>}
            <input {...rest} className={styles.inputElement} />
            {onClear && <button className={styles.clearButton} onClick={onClear}>X</button>}
            {description && <p className={styles.inputDescription}>{description}</p>}
        </div>
    );
};

export default Input;