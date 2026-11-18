import api from "./api";
import type {
  ApiMessageResponse,
  CreateReviewInput,
  Review,
  ReviewListResponse,
} from "../types/reviewType";

export async function listReviews(): Promise<Review[]> {
  const response = await api.get<ReviewListResponse>("/api/reviews/list");
  return response.data.reviews ?? [];
}

export async function deleteReview(
  reviewId: string
): Promise<ApiMessageResponse> {
  const response = await api.delete<ApiMessageResponse>("/api/reviews/delete", {
    data: { reviewId },
  });
  return response.data;
}

export async function createReview(
  input: CreateReviewInput
): Promise<ApiMessageResponse> {
  const formData = new FormData();
  formData.append("productId", input.productId);
  formData.append("platform", input.platform);
  formData.append("message", input.message);
  formData.append("date", String(input.date));
  formData.append("userName", input.userName);

  if (input.media && input.mediaType) {
    formData.append("mediaUrl", input.media);
    formData.append("mediaType", input.mediaType);
  }

  if (input.userImage) {
    formData.append("userImage", input.userImage);
  }

  // Do not set Content-Type manually; the browser sets the multipart boundary.
  const response = await api.post<ApiMessageResponse>(
    "/api/reviews/add",
    formData,
    { timeout: 60000 }
  );
  return response.data;
}
