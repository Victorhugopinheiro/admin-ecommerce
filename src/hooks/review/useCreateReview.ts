import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { createReview } from "../../service/reviews";
import type {
  ApiMessageResponse,
  CreateReviewInput,
} from "../../types/reviewType";
import { REVIEWS_QUERY_KEY } from "./useReviews";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation<ApiMessageResponse, unknown, CreateReviewInput>({
    mutationFn: createReview,
    onSuccess: (data) => {
      toast.success(data.message || "Avaliação registrada com sucesso.");
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(
          (err.response?.data as ApiMessageResponse | undefined)?.message ||
            "Erro ao registrar avaliação."
        );
        return;
      }
      toast.error("Erro inesperado ao registrar avaliação.");
    },
  });
}
