import api from "./api";
import type { ApiSuccess, AuthResponse, User } from "../types";

export async function login(email: string, password: string) {
  const { data } = await api.post<ApiSuccess<AuthResponse>>("/auth/login", { email, password });
  return data.data;
}

export async function getMe() {
  const { data } = await api.get<ApiSuccess<User>>("/auth/me");
  return data.data;
}
