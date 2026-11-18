import api from "./api";
import type {
  ApiMessageResponse,
  CreateReviewInput,
} from "../types/reviewType";

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
