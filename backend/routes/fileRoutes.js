const express = require('express');

const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
    deleteFile, getFile, getFiles, uploadFile,
} = require('../controllers/fileController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/').get(protect, getFiles).post(protect, upload.single('file'), uploadFile);
router.route('/:id').get(protect, getFile).delete(protect, deleteFile);

module.exports = router;
