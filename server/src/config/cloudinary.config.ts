// config/cloudinary.config.ts

export default () => ({
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'default_cloud_name',
        apiKey: process.env.CLOUDINARY_API_KEY || 'default_api_key',
        apiSecret: process.env.CLOUDINARY_API_SECRET || 'default_api_secret',
        uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || null, // optional, only if using unsigned uploads
    }
});