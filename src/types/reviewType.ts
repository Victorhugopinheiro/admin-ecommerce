export type MediaType = "image" | "video";

export interface CreateReviewInput {
  productId: string;
  platform: string;
  message: string;
  /** Unix timestamp in milliseconds. */
  date: number;
  userName: string;
  media?: File;
  mediaType?: MediaType;
  userImage?: File;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}
