import { useQuery } from "@tanstack/react-query";
import { listReviews } from "../../service/reviews";
import type { Review } from "../../types/reviewType";

export const REVIEWS_QUERY_KEY = ["reviews"] as const;

export function useReviews() {
  return useQuery<Review[]>({
    queryKey: REVIEWS_QUERY_KEY,
    queryFn: listReviews,
    staleTime: 30_000,
  });
}
