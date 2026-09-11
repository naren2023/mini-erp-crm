import api from "./api";
import type { ApiSuccess, DashboardData } from "../types";

export async function getDashboard() {
  const { data } = await api.get<ApiSuccess<DashboardData>>("/dashboard");
  return data.data;
}
