import { useState, useMemo, useCallback, Suspense } from 'react';
import { extractInfiniteQueryResults } from '../../utils';
import { PokemonList, Header, PokemonInfoDialog } from '../../components';
import { Loader, ErrorMessage } from '../../components/ui';
import { usePokemonQuery } from '../../hooks';
import styles from './MainPage.module.css';

const MainPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(null)

    const { getPokemonList, searchPokemon, getFavoritesList } = usePokemonQuery();

    const { data: listData, isLoading: isListLoading, isError: isListError, fetchNextPage: fetchNextListPage } = getPokemonList();
    const { data: searchData, isLoading: isSearchLoading, isError: isSearchError } = searchPokemon(searchQuery);
    const { data: favoritesData, isLoading: isFavoritesLoading, isError: isFavoritesError } = getFavoritesList(showFavorites);

    const pokemonList = useMemo(() => {
        if (showFavorites) {
            return extractInfiniteQueryResults(favoritesData?.pages);
        }
        if (searchQuery && searchData?.results) {
            return searchData.results;
        }
        return extractInfiniteQueryResults(listData?.pages);
    }, [showFavorites, searchQuery, searchData, listData, favoritesData])

    const hasNextPage = useMemo(() => {
        if (!listData?.pages) return false;
        const lastPage = listData.pages[listData.pages.length - 1];
        return lastPage?.results.length === 150;
    }, [listData]);

    const handleSearch = useCallback((query: string) => {
        if (showFavorites) setShowFavorites(false);
        setSearchQuery(query);
    }, [showFavorites]);

    const handlePokemonSelect = useCallback((name: string | null) => {
        setSelectedPokemonName(name);
        setIsDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setSelectedPokemonName(null);
        setIsDialogOpen(false);
    }, []);

    const handleToggleFavorites = useCallback(() => {
        setShowFavorites(prev => !prev);
    }, []);


    const isError = showFavorites ? isFavoritesError : (searchQuery ? isSearchError : isListError);
    const isLoading = showFavorites ? isFavoritesLoading : (searchQuery ? isSearchLoading : isListLoading);

    const renderContent = () => {
        if (isError) {
            return <ErrorMessage message={showFavorites ? 'Failed to load favorites' : 'Failed to load pokemon list'} />;
        }
        if (isLoading) {
            return <Loader className={styles.loader} />;
        }
        if (!pokemonList.length) {
            return <ErrorMessage message='No pokemon found' />;
        }
        return <PokemonList pokemonList={pokemonList} onSelectPokemon={handlePokemonSelect} isLoading={isLoading} fetchNextPage={fetchNextListPage} hasNextPage={hasNextPage} />;
    }

    return (
        <div className={styles.mainPageContainer}>
            <Header
                onSearch={handleSearch}
                onToggleFavorites={handleToggleFavorites}
                showFavorites={showFavorites}
                isShowFavorites={showFavorites}
            />
            {renderContent()}
            <Suspense fallback={null}>
                {isDialogOpen && <PokemonInfoDialog pokemonName={selectedPokemonName} onClose={handleCloseDialog} />}
            </Suspense>
        </div>
    );
};

export default MainPage;