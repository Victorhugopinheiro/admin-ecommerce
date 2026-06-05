import React, { createContext, useCallback, useEffect, useState } from "react";
import api from "../service/api";
import axios from "axios";
import { toast } from "react-toastify";



export interface Product {
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
    authenticated?: boolean;
    setAuthenticated: (authenticated: boolean) => void;
    logout: () => void;
    defininProducts: ({ products }: { products: Product[] }) => void;
    products?: Product[];
    listProducts?: () => void;

}

export const UserContext = createContext({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

    const [products, setProducts] = useState<Product[] | []>([])
    const [authenticated, setAuthenticated] = useState(false);








    const logout = async () => {
        try {
            const response = await api.post("/api/users/logoutAdmin");

            if (response.data.success) {
                setAuthenticated(false);
                toast.success("Logout realizado com sucesso.");
                window.location.href = "/admin/login";
            } else {
                toast.error("Erro ao fazer logout.");
                setAuthenticated(false);
            }



        } catch (err) {
            toast.error("Erro ao fazer logout.");
        }


    }


    const defininProducts = ({ products }: { products: Product[] }) => {
        setProducts(products);
    }


    const verifyAuth = async () => {
        try {
            const response = await api.get("/api/users/adminDetails");

            if (response.data?.success) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
                alert("Não autenticado. Verifique se o token é válido.");
            }

        } catch (err) {
            setAuthenticated(false);
        }
    }

    const listProducts = async () => {


        try {

            const res = await api.get('/api/products/list');

            if (res.data?.success && Array.isArray(res.data.products)) {

                setProducts(res.data.products);
                setAuthenticated(true);


            }

        } catch (err) {

            setAuthenticated(false);

            if (axios.isAxiosError(err)) {

                if (err.response?.status === 401) {

                    toast.error("Não autorizado (401). Verifique se o token é válido / formato do header.");

                    logout();
                    window.location.href = "/";
                } else {
                    toast.error((err.response?.data as any)?.message || "Erro ao buscar produtos.");

                }
            } else {
                toast.error("Erro inesperado.");

            }

        }
    }

    useEffect(() => {

        
        verifyAuth();

        return () => { };

    }, [])



    return (
        <UserContext.Provider value={{ setAuthenticated, authenticated, logout, defininProducts, products }}>
            {children}
        </UserContext.Provider>
    );
};