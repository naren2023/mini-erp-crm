import api from "./api";
import type { ApiSuccess, Customer, FollowUp, Pagination } from "../types";

export async function listCustomers(params: Record<string, string | number | undefined>) {
  const { data } = await api.get<ApiSuccess<Customer[]>>("/customers", { params });
  return { items: data.data, pagination: data.pagination as Pagination };
}

export async function getCustomer(id: string) {
  const { data } = await api.get<ApiSuccess<Customer>>(`/customers/${id}`);
  return data.data;
}

export async function createCustomer(payload: Partial<Customer>) {
  const { data } = await api.post<ApiSuccess<Customer>>("/customers", payload);
  return data.data;
}

export async function updateCustomer(id: string, payload: Partial<Customer>) {
  const { data } = await api.put<ApiSuccess<Customer>>(`/customers/${id}`, payload);
  return data.data;
}

export async function deleteCustomer(id: string) {
  await api.delete(`/customers/${id}`);
}

export async function addFollowUp(id: string, payload: { note: string; followUpDate: string }) {
  const { data } = await api.post<ApiSuccess<FollowUp>>(`/customers/${id}/followups`, payload);
  return data.data;
}
