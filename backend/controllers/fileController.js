require('express');
const {
    DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { PythonShell } = require('python-shell');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/userModel');
const File = require('../models/fileModel');

/**
 * Setup
 */

// Configure AWS S3
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey,
    },
    region: bucketRegion,
});

// Configure python-shell
PythonShell.defaultOptions = { scriptPath: 'backend/scripts' };

const translateVideo = (videoFileName, languageCode) => {
    const options = {
        args: [
            bucketRegion,
            bucketName,
            videoFileName,
            languageCode,
            accessKey,
            secretAccessKey,
        ],
    };

    // Runs the video translation script
    return new Promise((resolve, reject) => {
        PythonShell.run('translate_video.py', options, (error, response) => {
            if (error) {
                console.log(error);
                reject();
            }

            // Returns the S3 File Url of the translated video
            console.log(response);
            const fileUrl = response[response.length - 1];
            resolve(fileUrl);
        });
    });
};

// Helper function that creates a random image name
const randomFileName = (bytes = 32) => `${crypto.randomBytes(bytes).toString('hex')}.mp4`;

/**
 * API
 */

// @desc    Get all files
// @route   GET /api/files
// @access  Private
const getFiles = asyncHandler(async (req, res) => {
    const files = await File.find({ user: req.user.id });

    // Iterates through all files and returns them along with an S3 signed url
    for (const file of files) {
        const getObjectParams = {
            Bucket: bucketName,
            Key: file.fileName,
        };

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        file.fileUrl = url;
    }

    res.send(files);
});

// @desc    Get a file
// @route   GET /api/files/:id
// @access  Private
const getFile = asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.id);

    if (!file) {
        res.status(404);
        throw new Error('File not found');
    }

    if (file.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Returns the file along with an S3 signed url
    const getObjectParams = {
        Bucket: bucketName,
        Key: file.fileName,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    file.fileUrl = url;

    res.send(file);
});

// @desc    Upload a video to be translated
// @route   POST /api/files
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
    const title = req.body.title;
    const outputLanguage = req.body.outputLanguage;

    // Validating input
    if (!req.file || !title || !outputLanguage) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    if (req.file.size > 1e8) {
        res.status(400);
        throw new Error('File too big! Size must be less than 100MB.');
    }

    const fileType = req.file.mimetype.slice(-3);
    if (fileType !== 'mp4') {
        res.status(400);
        throw new Error('File must be in MP4 format');
    }

    const supportedLanguages = new Set([
        'en', 'zh', 'hi', 'es', 'fr',
        'ca', 'da', 'de', 'is', 'it',
        'ja', 'ko', 'no', 'pl', 'pt',
        'ro', 'ru', 'tr', 'cy']);

    if (!supportedLanguages.has(outputLanguage)) {
        res.status(400);
        throw new Error('This language is not supported!');
    }

    // Uploads file to S3
    const fileName = randomFileName();
    const originalVideoParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };

    const s3command = new PutObjectCommand(originalVideoParams);
    await s3.send(s3command);

    // Calls script to transcribe, translate, and add text-to-speech to the given video
    try {
        const fileUrl = await translateVideo(fileName, outputLanguage);

        // Call cleanup script
        PythonShell.run('cleanup.py', null, (error, response) => {
            if (error) {
                console.log(error);
            }
        });

        // Stores file information in database
        const fileInfo = await File.create({
            user: req.user.id,
            fileName,
            title,
            fileUrl,
        });

        if (fileInfo) {
            res.status(200).json({
                _id: fileInfo.id,
                fileName: fileInfo.fileName,
                title: fileInfo.title,
                fileUrl: fileInfo.fileUrl,
            });
        } else {
            res.status(400);
            throw new Error('Invalid file data');
        }
    } catch (error) {
        res.status(400);
        throw new Error('An error was encountered while translating this video');
    }
});

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.id);

    if (!file) {
        res.status(404);
        throw new Error('File not found');
    }

    const user = await User.findById(req.user.id);

    // Check for user
    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the file belongs to the logged in user
    if (file.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const params = {
        Bucket: bucketName,
        Key: file.fileName,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    await File.deleteOne(file);

    res.status(200).json({ message: `Deleted file ${req.params.id}` });
});

module.exports = {
    getFiles,
    getFile,
    uploadFile,
    deleteFile,
};
