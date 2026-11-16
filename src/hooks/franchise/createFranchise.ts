import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../../service/api";
import type { ApiMessageResponse } from "../../types/categoryType";
import { toast } from "react-toastify";
import { FRANCHISES_QUERY_KEY } from "./useFranchise";

export function useCreateFranchise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (franchiseInput: string) => {
      const response = await api.post("/api/franchises/add", franchiseInput);
      return response.data.franchise as ApiMessageResponse;
    },

    onError: (error) => {
      console.error("Error creating franchise:", error);
      throw error;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Franquisa criada com sucesso.");
      queryClient.invalidateQueries({ queryKey: FRANCHISES_QUERY_KEY });
    },
  });
}
