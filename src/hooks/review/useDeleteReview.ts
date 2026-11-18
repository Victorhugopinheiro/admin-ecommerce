import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { deleteReview } from "../../service/reviews";
import type { ApiMessageResponse, Review } from "../../types/reviewType";
import { REVIEWS_QUERY_KEY } from "./useReviews";

type DeleteReviewContext = {
  previous?: Review[];
};

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<ApiMessageResponse, unknown, string, DeleteReviewContext>({
    mutationFn: deleteReview,
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: REVIEWS_QUERY_KEY });
      const previous = queryClient.getQueryData<Review[]>(REVIEWS_QUERY_KEY);

      queryClient.setQueryData<Review[]>(REVIEWS_QUERY_KEY, (current) =>
        current?.filter((review) => review._id !== reviewId)
      );

      return { previous };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Avaliação excluída com sucesso.");
    },
    onError: (err, _reviewId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(REVIEWS_QUERY_KEY, context.previous);
      }

      if (axios.isAxiosError(err)) {
        toast.error(
          (err.response?.data as ApiMessageResponse | undefined)?.message ||
            "Erro ao excluir avaliação."
        );
        return;
      }
      toast.error("Erro inesperado ao excluir avaliação.");
    },
  });
}
