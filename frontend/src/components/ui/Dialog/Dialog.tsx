import { useEffect, useState, ReactNode } from 'react';
import { CircleX } from 'lucide-react';
import { Button, Card, DialogLoader, ErrorMessage } from '../';
import styles from './Dialog.module.css';

interface DialogProps {
    className?: string;
    onClose: () => void;
    children: ReactNode | ReactNode[];
    isLoading?: boolean;
    loadingText?: string;
    hasError?: boolean;
    errorMessage?: string;
    testId?: string;
}

const Dialog = ({ children, className = '', onClose, isLoading = false, loadingText, hasError = false, errorMessage, testId }: DialogProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsVisible(true);
        });
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    const renderDialogContent = () => {
        if (isLoading) return <DialogLoader loadingText={loadingText} />;
        if (hasError) return <ErrorMessage message={errorMessage} />;
        return children;
    }

    return (
        <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} data-testid={testId}>
            <Card className={`${styles.dialogContainer} ${className} ${isVisible ? styles.visible : ''}`}>
                <Button onClick={handleClose} className={styles.closeButton} variant='icon'><CircleX /></Button>
                {renderDialogContent()}
            </Card>
        </div>
    );
};

export default Dialog;