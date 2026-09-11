import { BaseError } from './baseErrorClass.js';
import { HttpConstants } from '@constants/allConstant.js';

const errorStatus = HttpConstants.statusCode;

export class ConflictError extends BaseError {
  constructor(message: string = errorStatus.CONFLICT.message) {
    super(errorStatus.CONFLICT.code, message);
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string = errorStatus.BAD_REQUEST.message) {
    super(errorStatus.BAD_REQUEST.code, message);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = errorStatus.NOT_FOUND.message) {
    super(errorStatus.NOT_FOUND.code, message);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string = 'Authentication required') {
    super(errorStatus.UNAUTHORIZED.code, message);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message: string = errorStatus.FORBIDDEN.message) {
    super(errorStatus.FORBIDDEN.code, message);
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string = errorStatus.INTERNAL_SERVER_ERROR.message) {
    super(errorStatus.INTERNAL_SERVER_ERROR.code, message);
  }
}

export class ExpiredError extends BaseError {
  constructor(entity: string = 'Resource') {
    super(errorStatus.UNAUTHORIZED.code, `${entity} has expired`);
  }
}
