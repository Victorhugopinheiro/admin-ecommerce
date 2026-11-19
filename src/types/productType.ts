export interface ProductModel {
  name: string;
  image: string;
  price: number;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  subCategory: string;
  sizes: string[];
  bestSeller: boolean;
  image?: string[];
  price?: number;
  models?: ProductModel[];
}

export function productCover(product: {
  image?: string[];
  models?: { image?: string }[];
}): string | undefined {
  const modelImage = product.models?.[0]?.image;
  if (modelImage) return modelImage;
  return product.image?.[0];
}

export function productCardPrice(product: {
  price?: number;
  models?: { price: number }[];
}): number | null {
  if (product.models && product.models.length > 0) {
    const prices = product.models
      .map((model) => model.price)
      .filter((price) => typeof price === "number" && !Number.isNaN(price));
    if (prices.length === 0) return null;
    return Math.min(...prices);
  }
  return typeof product.price === "number" ? product.price : null;
}

export function formatBrl(value: number | null): string {
  if (value == null) return "—";
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
