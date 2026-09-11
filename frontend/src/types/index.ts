export type Role = "ADMIN" | "SALES" | "WAREHOUSE" | "ACCOUNTS";
export type CustomerType = "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
export type CustomerStatus = "LEAD" | "ACTIVE" | "INACTIVE";
export type MovementType = "IN" | "OUT";
export type ChallanStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse extends User {
  token: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
  pagination?: Pagination;
}

export interface ApiError {
  success: false;
  message: string;
  errors: Array<{ field?: string; message: string } | string>;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber: string | null;
  customerType: CustomerType;
  address: string;
  status: CustomerStatus;
  followUpDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  followUps?: FollowUp[];
}

export interface FollowUp {
  id: string;
  note: string;
  followUpDate: string;
  createdAt: string;
  creator?: { id: string; name: string; role: Role };
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: string | number;
  currentStock: number;
  minimumStock: number;
  warehouseLocation: string;
  createdAt: string;
  updatedAt: string;
  stockStatus?: "LOW_STOCK" | "IN_STOCK";
}

export interface StockMovement {
  id: string;
  quantity: number;
  movementType: MovementType;
  reason: string;
  createdAt: string;
  creator?: { id: string; name: string; role: Role };
}

export interface ChallanItem {
  id: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: string | number;
  quantity: number;
}

export interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  totalQuantity: number;
  status: ChallanStatus;
  createdAt: string;
  updatedAt: string;
  customer?: Pick<Customer, "id" | "name" | "businessName" | "mobile" | "address" | "gstNumber">;
  creator?: { id: string; name: string };
  items?: ChallanItem[];
}

export interface DashboardData {
  cards: {
    totalCustomers: number;
    totalProducts: number;
    lowStockProducts: number;
    totalChallans: number;
  };
  recentChallans: Challan[];
  lowStockProducts: Product[];
  followUps: Array<Pick<Customer, "id" | "name" | "businessName" | "status" | "followUpDate" | "mobile">>;
}
