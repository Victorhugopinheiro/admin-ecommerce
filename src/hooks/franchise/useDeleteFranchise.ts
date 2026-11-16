import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { deleteFranchise } from "../../service/franchises";
import type { ApiMessageResponse } from "../../types/franchiseType";
import { FRANCHISES_QUERY_KEY } from "./useFranchise";

export function useDeleteFranchise() {
  const queryClient = useQueryClient();

  return useMutation<ApiMessageResponse, unknown, string>({
    mutationFn: (franchiseId: string) => deleteFranchise(franchiseId),
    onSuccess: (data) => {
      toast.success(data.message || "Franquia excluída com sucesso.");
      queryClient.invalidateQueries({ queryKey: FRANCHISES_QUERY_KEY });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(
          (err.response?.data as ApiMessageResponse | undefined)?.message ||
            "Erro ao excluir franquia."
        );
      } else {
        toast.error("Erro inesperado ao excluir franquia.");
      }
    },
  });
}
