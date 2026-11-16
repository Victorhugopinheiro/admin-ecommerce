import api from "./api";
import type {
  ApiMessageResponse,
  CreateFranchiseInput,
  Franchise,
  FranchiseListResponse,
} from "../types/franchiseType";

export async function getFranchises(): Promise<Franchise[]> {
  const response = await api.get<FranchiseListResponse>("/api/franchises/list");
  return response.data.franchises;
}

export async function createFranchise({
  type,
}: CreateFranchiseInput): Promise<ApiMessageResponse> {
  const response = await api.post<ApiMessageResponse>("/api/franchises/add", {
    type,
  });
  return response.data;
}

export async function deleteFranchise(
  franchiseId: string
): Promise<ApiMessageResponse> {
  const response = await api.delete<ApiMessageResponse>(
    "/api/franchises/delete",
    {
      data: { franchiseId },
    }
  );
  return response.data;
}
