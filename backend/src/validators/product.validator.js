const { body } = require('express-validator');

exports.productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
];

exports.adjustStockRules = [
  body('adjustment').isInt().withMessage('Adjustment must be an integer'),
];
