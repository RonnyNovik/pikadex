import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Logo from '../../assets/logo.svg?react';
import { useAuth } from '../../hooks';
import { Button, Input } from '../ui';
import styles from './Header.module.css';

interface HeaderProps {
    onSearch: (query: string) => void;
    onToggleFavorites: () => void;
    showFavorites: boolean;
    isShowFavorites: boolean;
}

const Header = ({ onSearch, onToggleFavorites, showFavorites }: HeaderProps) => {
    const { onLogout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/auth');
    };

    return (
        <header className={styles.header}>
            <Logo className={styles.logo} />
            <Button className={styles.logoutButton} onClick={handleLogout} variant='icon'><LogOut /></Button>
            <Input
                type="text"
                placeholder="Search Pokémon..."
                className={styles.searchInput}
                onChange={(e) => onSearch(e.target.value)}
            />
            <Button className={styles.filterButton} onClick={onToggleFavorites}>
                {showFavorites ? 'Show All' : 'Show Favorites'}
            </Button>
        </header>
    );
};

export default memo(Header); 