import { useQuery } from "@tanstack/react-query";
import api from "../service/api";
import type { Category } from "../types/categoryType";



export function useGettingCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            try {
                const response = await api.get("/api/categories/list");
                return response.data.categories as Category[];
            } catch (error) {
                console.error("Error fetching categories:", error);
                throw error;
            }


        }
    });
}