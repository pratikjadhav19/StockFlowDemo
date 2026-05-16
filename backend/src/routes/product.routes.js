const router = require('express').Router();
const ctrl = require('../controllers/product.controller');
const { productRules, adjustStockRules } = require('../validators/product.validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', ctrl.getProducts);
router.get('/:id', ctrl.getProduct);
router.post('/', productRules, validate, ctrl.createProduct);
router.put('/:id', productRules, validate, ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);
router.patch('/:id/adjust', adjustStockRules, validate, ctrl.adjustStock);

module.exports = router;
