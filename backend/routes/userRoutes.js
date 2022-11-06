const express = require('express');
const { getMe, loginUser, registerUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '1800');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
});

module.exports = router;
