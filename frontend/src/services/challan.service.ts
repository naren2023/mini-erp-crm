import api from "./api";
import type { ApiSuccess, Challan, Pagination } from "../types";

export async function listChallans(params: Record<string, string | number | undefined>) {
  const { data } = await api.get<ApiSuccess<Challan[]>>("/challans", { params });
  return { items: data.data, pagination: data.pagination as Pagination };
}

export async function getChallan(id: string) {
  const { data } = await api.get<ApiSuccess<Challan>>(`/challans/${id}`);
  return data.data;
}

export async function createChallan(payload: { customerId: string; items: Array<{ productId: string; quantity: number }> }) {
  const { data } = await api.post<ApiSuccess<Challan>>("/challans", payload);
  return data.data;
}

export async function updateChallan(id: string, payload: { customerId: string; items: Array<{ productId: string; quantity: number }> }) {
  const { data } = await api.put<ApiSuccess<Challan>>(`/challans/${id}`, payload);
  return data.data;
}

export async function confirmChallan(id: string) {
  const { data } = await api.post<ApiSuccess<Challan>>(`/challans/${id}/confirm`);
  return data.data;
}

export async function cancelChallan(id: string) {
  const { data } = await api.post<ApiSuccess<Challan>>(`/challans/${id}/cancel`);
  return data.data;
}
