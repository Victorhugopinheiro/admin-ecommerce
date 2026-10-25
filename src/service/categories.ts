import api from "./api";
import type { ApiMessageResponse, Category, CategoryListResponse, CreateCategoryInput } from "../types/categoryType";

export async function getCategories(): Promise<Category[]> {
    const response = await api.get<CategoryListResponse>("/api/categories/list");
    return response.data.categories;
}

export async function createCategory({ type, image }: CreateCategoryInput): Promise<ApiMessageResponse> {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("image", image);

    // Do not set Content-Type manually; axios/browser sets the multipart boundary automatically.
    const response = await api.post<ApiMessageResponse>("/api/categories/add", formData);
    return response.data;
}

export async function deleteCategory(categoryId: string): Promise<ApiMessageResponse> {
    const response = await api.delete<ApiMessageResponse>("/api/categories/delete", {
        data: { categoryId },
    });
    return response.data;
}
