import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { createFranchise } from "../../service/franchises";
import type {
  ApiMessageResponse,
  CreateFranchiseInput,
} from "../../types/franchiseType";
import { FRANCHISES_QUERY_KEY } from "./useFranchise";

export function useCreateFranchise() {
  const queryClient = useQueryClient();

  return useMutation<ApiMessageResponse, unknown, CreateFranchiseInput>({
    mutationFn: (input: CreateFranchiseInput) => createFranchise(input),
    onSuccess: (data) => {
      toast.success(data.message || "Franquia criada com sucesso.");
      queryClient.invalidateQueries({ queryKey: FRANCHISES_QUERY_KEY });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(
          (err.response?.data as ApiMessageResponse | undefined)?.message ||
            "Erro ao criar franquia."
        );
      } else {
        toast.error("Erro inesperado ao criar franquia.");
      }
    },
  });
}
