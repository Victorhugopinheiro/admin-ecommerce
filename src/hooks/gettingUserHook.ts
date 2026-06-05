import { useQuery } from '@tanstack/react-query'
import api from "../service/api"
import type { Product } from '../types/productType';



export function UserProducts() {
    return useQuery({
        queryKey: ['userProducts'],
        queryFn: async () => {
            try {
                const repsonse = await api.get("/api/products/list");


                return repsonse.data.products as Product[];

            } catch (err) {
                console.error("Error fetching user data:", err);
                throw err;
            }
        }
    })
}