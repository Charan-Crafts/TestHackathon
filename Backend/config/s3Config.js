const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Validate environment variables
const requiredEnvVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_BUCKET_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required AWS environment variables:', missingEnvVars);
    throw new Error(`Missing required AWS environment variables: ${missingEnvVars.join(', ')}`);
}

// S3 configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const bucketName = process.env.AWS_BUCKET_NAME;

// Upload a file to S3
const uploadToS3 = async (file, customKey = null) => {
    if (!file || !file.buffer) {
        throw new Error('Invalid file object. File must contain buffer.');
    }

    try {
        console.log('Starting S3 upload for file:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.buffer.length
        });

        const key = customKey || `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-access', // Set ACL to public-read
                Metadata: {
                    originalname: file.originalname,
                    mimetype: file.mimetype
                }
            }
        });

        console.log('Uploading to S3 with params:', {
            bucket: bucketName,
            key: key,
            contentType: file.mimetype
        });

        const result = await upload.done();

        console.log('S3 upload successful:', {
            location: result.Location,
            key: key
        });

        return {
            key: key,
            location: result.Location,
            bucket: bucketName
        };
    } catch (error) {
        console.error('S3 upload error details:', {
            error: error.message,
            code: error.code,
            statusCode: error.$metadata?.httpStatusCode,
            requestId: error.$metadata?.requestId
        });
        throw error;
    }
};

// Delete a file from S3
const deleteFromS3 = async (key) => {
    try {
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key
        });

        await s3Client.send(deleteCommand);
        return true;
    } catch (error) {
        console.error('S3 delete error:', error);
        throw error;
    }
};

// Generate a signed URL for temporary access
const getSignedUrl = async (key, expiresIn = 3600) => {
    const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
    const { GetObjectCommand } = require('@aws-sdk/client-s3');

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key
    });

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn });
        return url;
    } catch (error) {
        console.error('Signed URL generation error:', error);
        throw error;
    }
};

module.exports = {
    s3Client,
    uploadToS3,
    deleteFromS3,
    getSignedUrl,
    bucketName
}; 