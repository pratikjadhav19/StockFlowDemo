const router = require('express').Router();
const { signup, login, getMe } = require('../controllers/auth.controller');
const { signupRules, loginRules } = require('../validators/auth.validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post('/signup', signupRules, validate, signup);
router.post('/login', loginRules, validate, login);
router.get('/me', auth, getMe);

module.exports = router;
