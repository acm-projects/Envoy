const express = require('express');
const { getMe, loginUser, registerUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
