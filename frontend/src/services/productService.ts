import type { ApiEnvelope, Product } from '../types/product';

function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL?.trim() ?? '';
  return url.replace(/\/$/, '');
}

export async function fetchProducts(): Promise<Product[]> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/products`);

  if (!response.ok) {
    throw new Error(`Error del servidor (${response.status})`);
  }

  const body = (await response.json()) as ApiEnvelope<unknown>;

  if (body.errors?.length > 0) {
    throw new Error(body.errors[0].message);
  }

  if (!Array.isArray(body.data)) {
    throw new Error('Formato de respuesta inválido');
  }

  return body.data as Product[];
}
