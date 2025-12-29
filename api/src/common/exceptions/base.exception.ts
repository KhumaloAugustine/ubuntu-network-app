/**
 * Base exception class for all custom exceptions
 * Implements hierarchical exception system
 */
export class BaseException extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error (400)
 */
export class ValidationException extends BaseException {
  constructor(message: string, details?: Record<string, any>) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

/**
 * Authentication error (401)
 */
export class AuthenticationException extends BaseException {
  constructor(message: string = 'Authentication failed') {
    super('AUTHENTICATION_ERROR', message, 401);
  }
}

/**
 * Authorization error (403)
 */
export class AuthorizationException extends BaseException {
  constructor(message: string = 'Access denied') {
    super('AUTHORIZATION_ERROR', message, 403);
  }
}

/**
 * Resource not found (404)
 */
export class NotFoundException extends BaseException {
  constructor(resource: string, id?: string | number) {
    const message = id
      ? `${resource} with ID ${id} not found`
      : `${resource} not found`;
    super('NOT_FOUND', message, 404);
  }
}

/**
 * Conflict error (409)
 */
export class ConflictException extends BaseException {
  constructor(message: string, details?: Record<string, any>) {
    super('CONFLICT_ERROR', message, 409, details);
  }
}

/**
 * Internal server error (500)
 */
export class InternalServerException extends BaseException {
  constructor(message: string = 'Internal server error') {
    super('INTERNAL_SERVER_ERROR', message, 500);
  }
}
