import React, { createContext, useCallback, useEffect, useState } from "react";
import api from "../service/api";

interface UserContextType {
    token: string | null;
    setToken: (token: string | null, opts?: { remember?: boolean }) => void;
    logout: () => void;
}

export const UserContext = createContext({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {



    const [token, setTokenState] = useState<string | null>(() => {
        const saved = localStorage.getItem("auth:token");
        return saved ? saved : null;
    });



    useEffect(() => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common["Authorization"];
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