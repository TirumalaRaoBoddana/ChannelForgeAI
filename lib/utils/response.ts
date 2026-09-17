import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  requestId: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  requestId: string;
}

export function createSuccessResponse<T>(data: T, requestId?: string): SuccessResponse<T> {
  return {
    success: true,
    data,
    requestId: requestId || generateRequestId(),
  };
}

export function createErrorResponse(code: string, message: string, requestId?: string): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
    },
    requestId: requestId || generateRequestId(),
  };
}
