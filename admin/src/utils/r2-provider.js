import { BaseProvider } from '@adminjs/upload';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// R2 Connection Setup
const r2 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY,
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

export class R2CustomProvider extends BaseProvider {
    constructor() {
        super(BUCKET_NAME);
        console.log('R2CustomProvider initialized with bucket:', BUCKET_NAME);
    }

    // 1. UPLOAD FUNCTION
    async upload(file, key) {
        console.log('R2 Uploading file:', file.name, 'with suggested key:', key);

        // Use suggested key if provided and valid, otherwise generate one
        const standardName = key || `products/img_${uuidv4()}.webp`;
        console.log('Final standardized name to use:', standardName);

        // Process with Sharp (Resize + WebP)
        let buffer;
        if (file.path) {
            // If file comes from local temp path (e.g., formidable)
            buffer = await sharp(file.path)
                .resize(800, 800, {
                    fit: 'cover',
                    position: 'entropy'
                })
                .webp({ quality: 80 })
                .toBuffer();
        } else {
            throw new Error('File path missing');
        }

        // Upload to R2
        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: standardName,
            Body: buffer,
            ContentType: 'image/webp'
        };

        await r2.send(new PutObjectCommand(uploadParams));

        console.log('R2 Upload successful. Returning key to save in DB:', standardName);
        // Return the key to be saved in DB
        return standardName;
    }

    // 2. DELETE FUNCTION
    async delete(key, bucket) {
        try {
            await r2.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
        } catch (error) {
            console.error('Error deleting file from R2:', error);
        }
    }

    // 3. GET URL
    async path(key, bucket) {
        // Return Public URL
        return `${process.env.CDN_URL}/${key}`;
    }
}
