
import errorIcon from '../../../assets/error.png';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    message?: string;
}

const ErrorMessage = ({ message = 'An error occurred, Please try again later.' }: ErrorMessageProps) => {
    return (
        <div className={styles.errorMessageContainer}>
            <img className={styles.errorIcon} src={errorIcon} alt="error" />
            <p className={styles.errorMessage}>{message}</p>
        </div>
    );
};

export default ErrorMessage;