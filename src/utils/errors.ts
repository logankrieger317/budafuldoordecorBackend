export class AppError extends Error {
  constructor(
    public statusCode: number,
    public status: string,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'validation_error', message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, 'authentication_error', message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized') {
    super(403, 'authorization_error', message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'not_found', `${resource} not found`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'conflict', message);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(429, 'rate_limit_exceeded', message);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(500, 'database_error', message, true);
  }
}

export class ServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, 'server_error', message, true);
  }
}
