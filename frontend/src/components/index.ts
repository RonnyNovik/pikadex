import { lazy } from 'react';

export { default as AbilitiesTab } from './AbilitiesTab/AbilitiesTab';
export { default as AuthForm } from './AuthForm/AuthForm';
export { default as EvolutionChainTab } from './EvolutionChainTab/EvolutionChainTab';
export { default as FavoriteButton } from './FavoriteButton/FavoriteButton';
export { default as Header } from './Header/Header';
export { default as PokemonCard } from './PokemonCard/PokemonCard';
export { default as PokemonImage } from './PokemonImage/PokemonImage';
export { default as PokemonList } from './PokemonList/PokemonList';
export { default as PokemonTypeTag } from './PokemonTypeTag/PokemonTypeTag';
export const PokemonInfoDialog = lazy(() => import('./PokemonInfoDialog/PokemonInfoDialog'));
