const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
    deleteFile, getFile, getFiles, uploadFile,
} = require('../controllers/fileController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/').get(protect, getFiles).post(protect, upload.single('file'), uploadFile);
router.route('/:id').get(protect, getFile).delete(protect, deleteFile);

router.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '1800');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
});

module.exports = router;
