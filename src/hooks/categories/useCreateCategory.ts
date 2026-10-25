import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { createCategory } from "../../service/categories";
import type { ApiMessageResponse, CreateCategoryInput } from "../../types/categoryType";
import { CATEGORIES_QUERY_KEY } from "./useCategories";

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation<ApiMessageResponse, unknown, CreateCategoryInput>({
        mutationFn: (input: CreateCategoryInput) => createCategory(input),
        onSuccess: (data) => {
            toast.success(data.message || "Categoria criada com sucesso.");
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                toast.error((err.response?.data as ApiMessageResponse | undefined)?.message || "Erro ao criar categoria.");
            } else {
                toast.error("Erro inesperado ao criar categoria.");
            }
        },
    });
}
