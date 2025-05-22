const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const { uploadToS3 } = require('../config/s3Config');

// Configure storage to use memory storage instead of disk
const storage = multer.memoryStorage();

// File filter to validate types
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip|rar|xls|xlsx|ppt|pptx|csv|txt/;

    // Check extension
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    // Check mime type
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error(`File type not supported! File: ${file.originalname}, Type: ${file.mimetype}`), false);
    }
};

// Configure upload settings
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB file size limit
    },
    fileFilter: fileFilter
});

// Middleware for single file upload
exports.uploadSingleFile = (fieldName) => async (req, res, next) => {
    console.log(`Starting single file upload for field: ${fieldName}`);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    const uploadMiddleware = upload.single(fieldName);

    uploadMiddleware(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred
            console.error('Multer error:', {
                code: err.code,
                field: err.field,
                message: err.message
            });

            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new ErrorResponse('File size too large. Maximum size is 50MB', 400));
            }
            return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
        } else if (err) {
            // A non-Multer error occurred
            console.error('Non-Multer error:', err);
            return next(new ErrorResponse(err.message, 400));
        }

        // If no file was uploaded, just continue
        if (!req.file) {
            console.log('No file uploaded for field:', fieldName);
            return next(new ErrorResponse('Please upload a file', 400));
        }

        try {
            console.log('File received:', {
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });

            // Upload to S3
            const s3Result = await uploadToS3(req.file);

            // Add S3 info to the request object
            req.file.key = s3Result.key;
            req.file.location = s3Result.location;
            req.file.bucket = s3Result.bucket;

            console.log('S3 upload successful:', {
                key: s3Result.key,
                location: s3Result.location,
                bucket: s3Result.bucket
            });

            // Remove buffer from response
            delete req.file.buffer;
            next();
        } catch (error) {
            console.error('S3 upload error:', {
                message: error.message,
                stack: error.stack,
                details: error
            });
            return next(new ErrorResponse('Error uploading to S3: ' + error.message, 500));
        }
    });
};

// Middleware for multiple file uploads
exports.uploadMultipleFiles = (fieldName, maxCount = 5) => async (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);

    uploadMiddleware(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new ErrorResponse('File size too large. Maximum size is 10MB', 400));
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return next(new ErrorResponse(`Too many files. Maximum is ${maxCount}`, 400));
            }
            return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
        } else if (err) {
            return next(new ErrorResponse(err.message, 400));
        }

        try {
            if (req.files && req.files.length > 0) {
                // Upload all files to S3
                const uploadPromises = req.files.map(async (file) => {
                    const s3Result = await uploadToS3(file);
                    // Add S3 info to the file object
                    file.key = s3Result.key;
                    file.location = s3Result.location;
                    file.bucket = s3Result.bucket;
                    // Remove buffer from response
                    delete file.buffer;
                    return file;
                });

                await Promise.all(uploadPromises);
            }
            next();
        } catch (error) {
            return next(new ErrorResponse('Error uploading to S3: ' + error.message, 500));
        }
    });
};

// Middleware for multiple file uploads with different field names
exports.uploadFields = (fields) => async (req, res, next) => {
    const uploadMiddleware = upload.fields(fields);

    uploadMiddleware(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new ErrorResponse('File size too large. Maximum size is 10MB', 400));
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return next(new ErrorResponse(`Unexpected file field. Expected: ${fields.map(f => f.name).join(', ')}`, 400));
            }
            return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
        } else if (err) {
            return next(new ErrorResponse(err.message, 400));
        }

        try {
            // Process each field's files
            for (const field of Object.keys(req.files || {})) {
                const files = req.files[field];
                const uploadPromises = files.map(async (file) => {
                    const s3Result = await uploadToS3(file);
                    // Add S3 info to the file object
                    file.key = s3Result.key;
                    file.location = s3Result.location;
                    file.bucket = s3Result.bucket;
                    // Remove buffer from response
                    delete file.buffer;
                    return file;
                });

                await Promise.all(uploadPromises);
            }
            next();
        } catch (error) {
            return next(new ErrorResponse('Error uploading to S3: ' + error.message, 500));
        }
    });
}; 