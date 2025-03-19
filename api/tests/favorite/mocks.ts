export const mockOneFavorite = [
    { id: 1, name: 'bulbasaur', is_favorite: true }
];

export const mockEmptyPayload = {
    results: [],
    pagination: { offset: 0, limit: 10 }
};

export const mockTwoFavorites = [
    { pokemonId: 1, name: 'Bulbasaur' },
    { pokemonId: 4, name: 'Charmander' }
];

export const mockTwoFavoritesWithIsFavorite = [
    { id: 1, name: 'Bulbasaur', is_favorite: true },
    { id: 4, name: 'Charmander', is_favorite: true }
];
