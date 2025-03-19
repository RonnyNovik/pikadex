import { createContext } from 'react';

export interface AuthContextType {
    token: string | null;
    onLogin: (token: string) => void;
    onLogout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
