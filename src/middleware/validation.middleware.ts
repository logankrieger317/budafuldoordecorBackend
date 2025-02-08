import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../utils/errors';

// Auth validation schemas
export const registerValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Please provide a valid phone number'),
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Order validation schemas
export const createOrderValidation: ValidationChain[] = [
  body('customerEmail')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),
  body('shippingAddress')
    .trim()
    .notEmpty()
    .withMessage('Shipping address is required'),
  body('billingAddress')
    .trim()
    .notEmpty()
    .withMessage('Billing address is required'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.productSku')
    .notEmpty()
    .withMessage('Product SKU is required for each item'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1 for each item'),
];

// Favorites validation schemas
export const addFavoriteValidation: ValidationChain[] = [
  body('productSku')
    .notEmpty()
    .withMessage('Product SKU is required'),
];

// Pagination validation
export const paginationValidation: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

// ID parameter validation
export const idParamValidation: ValidationChain[] = [
  param('id')
    .isUUID(4)
    .withMessage('Invalid ID format'),
];

// SKU parameter validation
export const skuParamValidation: ValidationChain[] = [
  param('productSku')
    .notEmpty()
    .withMessage('Product SKU is required'),
];

// Product validation middleware
export const validateProduct = (productType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    // Validate base product fields
    if (!body.name || typeof body.name !== 'string') {
      return res.status(400).json({ error: 'Name is required and must be a string' });
    }
    if (!body.description || typeof body.description !== 'string') {
      return res.status(400).json({ error: 'Description is required and must be a string' });
    }
    if (!body.price || typeof body.price !== 'number' || body.price <= 0) {
      return res.status(400).json({ error: 'Price is required and must be a positive number' });
    }
    if (!body.imageUrl || typeof body.imageUrl !== 'string') {
      return res.status(400).json({ error: 'Image URL is required and must be a string' });
    }

    // Validate product-specific fields
    switch (productType) {
      case 'ribbon':
        if (!body.ribbonLength || typeof body.ribbonLength !== 'string') {
          return res.status(400).json({ error: 'Ribbon length is required and must be a string' });
        }
        if (!body.ribbonWidth || typeof body.ribbonWidth !== 'string') {
          return res.status(400).json({ error: 'Ribbon width is required and must be a string' });
        }
        if (!Array.isArray(body.ribbonColors) || body.ribbonColors.length === 0) {
          return res.status(400).json({ error: 'Ribbon colors are required and must be a non-empty array' });
        }
        if (!body.ribbonPattern || typeof body.ribbonPattern !== 'string') {
          return res.status(400).json({ error: 'Ribbon pattern is required and must be a string' });
        }
        break;

      case 'mum':
        if (!body.size || !['small', 'medium', 'large', 'extra-large'].includes(body.size)) {
          return res.status(400).json({ error: 'Size must be one of: small, medium, large, extra-large' });
        }
        if (!Array.isArray(body.baseColors) || body.baseColors.length === 0) {
          return res.status(400).json({ error: 'Base colors are required and must be a non-empty array' });
        }
        if (!Array.isArray(body.accentColors) || body.accentColors.length === 0) {
          return res.status(400).json({ error: 'Accent colors are required and must be a non-empty array' });
        }
        if (typeof body.hasLights !== 'boolean') {
          return res.status(400).json({ error: 'Has lights must be a boolean' });
        }
        break;

      case 'braid':
        if (!body.braidLength || typeof body.braidLength !== 'string') {
          return res.status(400).json({ error: 'Braid length is required and must be a string' });
        }
        if (!Array.isArray(body.braidColors) || body.braidColors.length === 0) {
          return res.status(400).json({ error: 'Braid colors are required and must be a non-empty array' });
        }
        if (!body.braidPattern || typeof body.braidPattern !== 'string') {
          return res.status(400).json({ error: 'Braid pattern is required and must be a string' });
        }
        break;

      case 'wreath':
        if (!body.diameter || typeof body.diameter !== 'string') {
          return res.status(400).json({ error: 'Diameter is required and must be a string' });
        }
        if (!body.baseType || typeof body.baseType !== 'string') {
          return res.status(400).json({ error: 'Base type is required and must be a string' });
        }
        if (!body.season || typeof body.season !== 'string') {
          return res.status(400).json({ error: 'Season is required and must be a string' });
        }
        if (!Array.isArray(body.decorations) || body.decorations.length === 0) {
          return res.status(400).json({ error: 'Decorations are required and must be a non-empty array' });
        }
        break;

      case 'seasonal':
        if (!body.season || !['spring', 'summer', 'fall', 'winter', 'holiday'].includes(body.season)) {
          return res.status(400).json({ error: 'Season must be one of: spring, summer, fall, winter, holiday' });
        }
        if (!body.type || typeof body.type !== 'string') {
          return res.status(400).json({ error: 'Type is required and must be a string' });
        }
        if (!body.theme || typeof body.theme !== 'string') {
          return res.status(400).json({ error: 'Theme is required and must be a string' });
        }
        break;

      default:
        return res.status(400).json({ error: 'Invalid product type' });
    }

    next();
  };
};

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.location + '.' + err.path : err.type,
        message: err.msg
      }))
    });
  };
};

// Alias for backward compatibility
export const validateRequest = validate;
