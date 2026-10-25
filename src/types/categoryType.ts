export interface Category {
  _id: string;
  type: string;
  image: string;
}

export interface CreateCategoryInput {
  type: string;
  image: File;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

export interface CategoryListResponse {
  success: boolean;
  categories: Category[];
}
