import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../service/categories";
import type { Category } from "../../types/categoryType";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export function useCategories() {
    return useQuery<Category[]>({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: getCategories,
    });
}
