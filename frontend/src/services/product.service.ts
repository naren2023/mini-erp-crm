import api from "./api";
import type { ApiSuccess, Pagination, Product, StockMovement } from "../types";

export async function listProducts(params: Record<string, string | number | boolean | undefined>) {
  const { data } = await api.get<ApiSuccess<Product[]>>("/products", { params });
  return { items: data.data, pagination: data.pagination as Pagination };
}

export async function getProduct(id: string) {
  const { data } = await api.get<ApiSuccess<Product>>(`/products/${id}`);
  return data.data;
}

export async function createProduct(payload: Partial<Product>) {
  const { data } = await api.post<ApiSuccess<Product>>("/products", payload);
  return data.data;
}

export async function updateProduct(id: string, payload: Partial<Product>) {
  const { data } = await api.put<ApiSuccess<Product>>(`/products/${id}`, payload);
  return data.data;
}

export async function adjustStock(id: string, payload: { quantity: number; movementType: "IN" | "OUT"; reason: string }) {
  const { data } = await api.post<ApiSuccess<{ product: Product; movement: StockMovement }>>(`/products/${id}/stock`, payload);
  return data.data;
}

export async function listMovements(id: string, params: Record<string, number>) {
  const { data } = await api.get<ApiSuccess<StockMovement[]>>(`/products/${id}/movements`, { params });
  return { items: data.data, pagination: data.pagination as Pagination };
}
