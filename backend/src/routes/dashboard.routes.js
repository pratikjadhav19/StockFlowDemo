const router = require('express').Router();
const { getDashboard } = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth');

router.get('/', auth, getDashboard);

module.exports = router;
