import React, { createContext, useCallback, useEffect, useState } from "react";
import api from "../service/api";
import axios from "axios";
import { toast } from "react-toastify";



interface Product {
    _id: string;
    name: string;
    category: string;
    subCategory: string;
    sizes: string[];
    bestSeller: boolean;
    image: string[];
    price: number;
}

interface UserContextType {
    token: string | null;
    setToken: (token: string | null, opts?: { remember?: boolean }) => void;
    logout: () => void;
    defininProducts: ({ products }: { products: Product[] }) => void;
    products?: Product[];
    listProducts?: () => void;

}

export const UserContext = createContext({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

    const [products, setProducts] = useState<Product[] | []>([])

    const [token, setTokenState] = useState<string | null>(() => {
        const saved = localStorage.getItem("auth:token");
        if (saved) {
            // Ajuste aqui se seu backend NÃO usa o prefixo 'Bearer '
            api.defaults.headers.common.Authorization = `Bearer ${saved}`;
        }
        return saved || null;
    });

 
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


    const defininProducts = ({ products }: { products: Product[] }) => {
        setProducts(products);
    }

    const listProducts = async () => {
        if (!token) return;

        try {

            const res = await api.get('/api/products/list');

            if (res.data?.success && Array.isArray(res.data.products)) {

                setProducts( res.data.products );

            } else {
                toast.error("Erro ao buscar produtos.");
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {

                if (err.response?.status === 401) {
                    
                    toast.error("Não autorizado (401). Verifique se o token é válido / formato do header.");
                    logout();
                    window.location.href = "/admin/login";
                } else {
                    toast.error((err.response?.data as any)?.message || "Erro ao buscar produtos.");
                }
            } else {
                toast.error("Erro inesperado.");
            }
        } 
    }

    useEffect(() => {

        listProducts();

        return () => { };

    }, [token])

    return (
        <UserContext.Provider value={{ token, setToken, logout, defininProducts, products }}>
            {children}
        </UserContext.Provider>
    );
};