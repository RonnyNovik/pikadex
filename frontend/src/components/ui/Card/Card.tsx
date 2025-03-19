import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: ReactNode | ReactNode[];
    className?: string;
    onClick?: () => void;
}

const Card = ({ className = '', children, onClick }: CardProps) => {
    return (
        <div className={`${styles.cardContainer} ${className}`} onClick={onClick}>
            {children}
        </div>
    );
};

export default Card;