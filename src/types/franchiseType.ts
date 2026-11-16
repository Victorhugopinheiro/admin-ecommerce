export interface Franchise {
  _id: string;
  type: string;
}

export interface CreateFranchiseInput {
  type: string;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

export interface FranchiseListResponse {
  success: boolean;
  franchises: Franchise[];
}
