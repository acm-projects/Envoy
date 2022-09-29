const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const asyncHandler = require('express-async-handler')
const crypto = require('crypto');
const express = require("express");
const File = require('../models/fileModel')

// Configure AWS
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

// @desc    Get all files
// @route   GET /api/files
// @access  Private
const getFiles = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Get files' })
})

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

    if (!title) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    if (req.file.size > 1e8) {
        res.status(400)
        throw new Error('File too big! Size must be less than 100MB.')
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
    const file = await File.create({
        fileName,
        title
    })

    if (file) {
        res.status(200).json({
            _id: file.id,
            fileName: file.fileName,
            title: file.title
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
    res.status(200).json({ message: `Delete file ${req.params.id}` })
})

module.exports = {
    getFiles,
    getFile,
    uploadFile,
    deleteFile
}