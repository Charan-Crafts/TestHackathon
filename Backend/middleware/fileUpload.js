const multer = require('multer');
const path = require('path');
const { s3, BUCKET_NAME } = require('../config/s3Config');
const ErrorResponse = require('../utils/errorResponse');
const multerS3 = require('multer-s3');

// Configure storage for uploaded files using S3
const storage = multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    acl: 'private',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '-')}`);
    }
});

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
        cb(new Error('File type not supported! Please upload only images, documents, or archives.'), false);
    }
};

// Configure upload settings
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
    },
    fileFilter: fileFilter
});

// Middleware for single file upload
exports.uploadSingleFile = (fieldName) => (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);

    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new ErrorResponse('File size too large. Maximum size is 10MB', 400));
            }
            return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
        } else if (err) {
            // A non-Multer error occurred
            return next(new ErrorResponse(err.message, 400));
        }
        // File uploaded successfully
        next();
    });
};

// Middleware for multiple file uploads
exports.uploadMultipleFiles = (fieldName, maxCount = 5) => (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);

    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new ErrorResponse('File size too large. Maximum size is 10MB', 400));
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return next(new ErrorResponse(`Too many files. Maximum is ${maxCount}`, 400));
            }
            return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
        } else if (err) {
            // A non-Multer error occurred
            return next(new ErrorResponse(err.message, 400));
        }
        // Files uploaded successfully
        next();
    });
};

// Middleware for multiple file uploads with different field names
exports.uploadFields = (fields) => (req, res, next) => {
    const uploadMiddleware = upload.fields(fields);

    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new ErrorResponse('File size too large. Maximum size is 10MB', 400));
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return next(new ErrorResponse(`Unexpected file field. Expected: ${fields.map(f => f.name).join(', ')}`, 400));
            }
            return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
        } else if (err) {
            // A non-Multer error occurred
            return next(new ErrorResponse(err.message, 400));
        }
        // Files uploaded successfully
        next();
    });
}; 