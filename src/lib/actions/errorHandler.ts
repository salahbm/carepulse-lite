// Types
interface ErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

// Helper function for error responses
export function createErrorResponse(
  message: string,
  code: string
): ErrorResponse {
  return {
    error: {
      message,
      code,
    },
  };
}

// Error codes
export const ErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  NOT_FOUND: 'NOT_FOUND',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  SEARCH_ERROR: 'SEARCH_ERROR',
  FETCH_ERROR: 'FETCH_ERROR',
  REGISTRATION_ERROR: 'REGISTRATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
} as const;
