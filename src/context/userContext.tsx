import React, { createContext, useCallback, useEffect, useState } from "react";
import api from "../service/api";

interface UserContextType {
    token: string | null;
    setToken: (token: string | null, opts?: { remember?: boolean }) => void;
    logout: () => void;
}

export const UserContext = createContext({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    // Inicialização síncrona + já seta o header
    const [token, setTokenState] = useState<string | null>(() => {
        const saved = localStorage.getItem("auth:token");
        if (saved) {
            // Ajuste aqui se seu backend NÃO usa o prefixo 'Bearer '
            api.defaults.headers.common.Authorization = `Bearer ${saved}`;
        }
        return saved || null;
    });

    // Só log / ajuste dinâmico quando token mudar depois
    useEffect(() => {
        if (token) {
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
            console.log("[Auth] Authorization header set");
        } else {
            delete api.defaults.headers.common.Authorization;
            console.log("[Auth] Authorization header removed");
        }
    }, [token]);

    const setToken = useCallback((nextToken: string | null, opts?: { remember?: boolean }) => {
        setTokenState(nextToken);
        if (opts?.remember && nextToken) {
            localStorage.setItem("auth:token", nextToken);
        } else {
            localStorage.removeItem("auth:token");
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
    }, [setToken]);

    return (
        <UserContext.Provider value={{ token, setToken, logout }}>
            {children}
        </UserContext.Provider>
    );
};