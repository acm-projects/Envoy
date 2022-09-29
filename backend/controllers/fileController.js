const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const asyncHandler = require('express-async-handler')
const File = require('../models/fileModel');
const crypto = require('crypto');
require("express");

/**
 * Setup
 */

// Configure AWS S3
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion,
})

// Helper function that creates a random image name
const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

/**
 * API
 */

// @desc    Get all files
// @route   GET /api/files
// @access  Private
const getFiles = asyncHandler(async (req, res) => {
    const files = await File.find({})

    // Iterates through all files and retuns them
    for (f of files) {
        const getObjectParams = {
            Bucket: bucketName,
            Key: f.fileName,
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        f.fileUrl = url
    }

    res.send(files)
})

//! May be deleted in the future
// @desc    Get a file
// @route   GET /api/files/:id
// @access  Private
const getFile = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Get file ${req.params.id}` })
})

// @desc    Upload file
// @route   POST /api/files
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
    const title = req.body.title

    // Validating input
    if (!req.file || !title) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    if (req.file.size > 1e8) {
        res.status(400)
        throw new Error('File too big! Size must be less than 100MB.')
    }

    if (!req.file.mimetype.startsWith('video')) {
        res.status(400)
        throw new Error('File must be a video')
    }

    // Uploads to S3
    const fileName = randomFileName()
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }

    const command = new PutObjectCommand(params)
    await s3.send(command)

    // Stores file information in database
    const fileInfo = await File.create({
        fileName,
        title
    })

    if (fileInfo) {
        res.status(200).json({
            _id: fileInfo.id,
            fileName: fileInfo.fileName,
            title: fileInfo.title
        })
    } else {
        res.status(400)
        throw new Error('Invalid file data')
    }
})

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.id)

    if (!file) {
        res.status(404)
        throw new Error('File not found')
    }

    const params = {
        Bucket: bucketName,
        Key: file.fileName,
    }

    const command = new DeleteObjectCommand(params)
    await s3.send(command)

    await File.deleteOne(file)

    res.status(200).json({ message: `Deleted file ${req.params.id}` })
})

module.exports = {
    getFiles,
    getFile,
    uploadFile,
    deleteFile
}