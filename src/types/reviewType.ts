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

/** Product fields returned by the review list (`productId` is populated). */
export interface ReviewProductSummary {
  _id: string;
  name: string;
  image?: string[];
}

export interface Review {
  _id: string;
  productId: ReviewProductSummary | string | null;
  platform?: string;
  message?: string;
  /** Unix timestamp in milliseconds. Older records may omit it. */
  date?: number;
  userName?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  userImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewListResponse {
  success: boolean;
  message: string;
  reviews: Review[];
}
