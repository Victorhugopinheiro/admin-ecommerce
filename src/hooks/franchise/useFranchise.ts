import { useQuery } from "@tanstack/react-query";
import { getFranchises } from "../../service/franchises";
import type { Franchise } from "../../types/franchiseType";

export const FRANCHISES_QUERY_KEY = ["franchises"] as const;

export function useFranchise() {
  return useQuery<Franchise[]>({
    queryKey: FRANCHISES_QUERY_KEY,
    queryFn: getFranchises,
  });
}
