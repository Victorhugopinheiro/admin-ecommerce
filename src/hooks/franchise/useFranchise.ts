import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../service/api";
import type { ApiMessageResponse } from "../../types/categoryType";

export const FRANCHISES_QUERY_KEY = ["franchise"] as const;

export function useFranchise() {
  return useQuery({
    queryKey: FRANCHISES_QUERY_KEY,
    queryFn: () => api.get("/api/franchise/list"),
  });
}
