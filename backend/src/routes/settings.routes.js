const router = require('express').Router();
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', getSettings);
router.put('/', updateSettings);

module.exports = router;
