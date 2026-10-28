import { AppError } from '../utils/AppError.js';

export function notFoundHandler(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.path} not found`, 404, 'NOT_FOUND'));
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || 500;
  const payload = {
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR',
    },
  };

  if (err.details) {
    payload.error.details = err.details;
  }

  if (err.name === 'ValidationError' && err.errors) {
    payload.error.code = 'MONGOOSE_VALIDATION';
    payload.error.details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json(payload);
  }

  if (err.name === 'CastError') {
    payload.error.message = 'Invalid identifier';
    payload.error.code = 'INVALID_ID';
    return res.status(400).json(payload);
  }

  if (status >= 500 && process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(status >= 400 ? status : 500).json(payload);
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
