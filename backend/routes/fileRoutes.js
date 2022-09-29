const express = require('express')
const router = express.Router()
const { getFiles, getFile, uploadFile, deleteFile } = require('../controllers/fileController')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.route('/').get(getFiles).post(upload.single("file"), uploadFile)
router.route('/:id').get(getFile).delete(deleteFile)

module.exports = router