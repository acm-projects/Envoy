const { getMe, loginUser, registerUser } = require('../controllers/userController')
const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)


module.exports = router