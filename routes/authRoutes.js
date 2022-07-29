const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authentication');

const { login, verify } = require('../controllers/authController');

router.route('/login').post(login);
router.route('/verify').post(authenticate, verify);

module.exports = router;
