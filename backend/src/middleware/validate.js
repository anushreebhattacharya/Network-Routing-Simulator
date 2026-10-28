import { AppError } from '../utils/AppError.js';

export function requireJsonObject(req, res, next) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return next(new AppError('Request body must be a JSON object.', 400, 'VALIDATION_ERROR'));
  }
  return next();
}
