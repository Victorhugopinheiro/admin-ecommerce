import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { deleteCategory } from "../../service/categories";
import type { ApiMessageResponse } from "../../types/categoryType";
import { CATEGORIES_QUERY_KEY } from "./useCategories";

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation<ApiMessageResponse, unknown, string>({
        mutationFn: (categoryId: string) => deleteCategory(categoryId),
        onSuccess: (data) => {
            toast.success(data.message || "Categoria excluída com sucesso.");
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                toast.error((err.response?.data as ApiMessageResponse | undefined)?.message || "Erro ao excluir categoria.");
            } else {
                toast.error("Erro inesperado ao excluir categoria.");
            }
        },
    });
}
