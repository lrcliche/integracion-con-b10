export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image_url: string;
  created_at: string;
}

export interface ApiErrorItem {
  code: string;
  message: string;
}

export interface ApiEnvelope<T> {
  errors: ApiErrorItem[];
  data: T;
}
