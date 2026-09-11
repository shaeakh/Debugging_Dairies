const statusCode = {
  OK: { code: 200, status: 'success', message: 'Request Successful' },
  CREATED: { code: 201, status: 'success', message: 'Resource Created' },
  NO_CONTENT: { code: 204, status: 'success', message: 'No Content' },
  BAD_REQUEST: { code: 400, status: 'fail', message: 'Bad Request' },
  UNAUTHORIZED: { code: 401, status: 'fail', message: 'Unauthorized Access' },
  FORBIDDEN: { code: 403, status: 'fail', message: 'Access Forbidden' },
  NOT_FOUND: { code: 404, status: 'fail', message: 'Resource Not Found' },
  CONFLICT: { code: 409, status: 'fail', message: 'Resource Conflict' },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    status: 'error',
    message: 'Server Error',
  },
  BAD_GATEWAY: { code: 502, status: 'error', message: 'Bad Gateway' },
  SERVICE_UNAVAILABLE: {
    code: 503,
    status: 'error',
    message: 'Service Unavailable',
  },
};

export { statusCode };
