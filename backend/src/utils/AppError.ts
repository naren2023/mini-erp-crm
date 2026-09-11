export class AppError extends Error {
  statusCode: number;
  errors: unknown[];
  code?: string;

  constructor(message: string, statusCode = 400, errors: unknown[] = [], code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
    this.name = "AppError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, [], "UNAUTHENTICATED");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403, [], "FORBIDDEN");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, [], "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationAppError extends AppError {
  constructor(message = "Validation failed", errors: unknown[] = []) {
    super(message, 422, errors, "VALIDATION_ERROR");
    this.name = "ValidationAppError";
  }
}

export class InsufficientStockError extends AppError {
  constructor(message: string) {
    super(message, 409, [], "INSUFFICIENT_STOCK");
    this.name = "InsufficientStockError";
  }
}

export class InvalidChallanStateError extends AppError {
  constructor(message: string) {
    super(message, 409, [], "INVALID_CHALLAN_STATE");
    this.name = "InvalidChallanStateError";
  }
}

export class DuplicateSkuError extends AppError {
  constructor(message = "A product with this SKU already exists") {
    super(message, 409, [], "DUPLICATE_SKU");
    this.name = "DuplicateSkuError";
  }
}
