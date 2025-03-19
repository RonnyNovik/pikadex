import { AuthContext } from "../context/AuthContext";
import { ReactNode, useState } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    const onLogin = (newToken: string) => {
        setToken(newToken);
    };

    const onLogout = () => {
        setToken(null);
    };

    const state = {
        token,
        onLogin,
        onLogout,
        isAuthenticated: !!token
    }

    return (
        <AuthContext.Provider value={state}>
            {children}
        </AuthContext.Provider>
    );
};