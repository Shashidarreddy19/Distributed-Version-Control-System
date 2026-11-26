const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const S3_BUCKET = process.env.S3_BUCKET;

// Only configure AWS if credentials are present in .env
// The push/pull CLI commands will fail with a clear message if not set,
// but the web server starts fine without them.
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || "ap-south-1",
    });
} else {
    console.warn(
        "[aws-config] AWS credentials not set in .env — push/pull commands will not work. " +
        "Add AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET to backend/.env to enable them."
    );
}

const s3 = new AWS.S3();

module.exports = { s3, S3_BUCKET };
