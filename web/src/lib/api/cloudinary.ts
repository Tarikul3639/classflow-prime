// src/api/cloudinary.ts
export interface CloudinarySignature {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: string;
}

// NEXT_PUBLIC_ prefix = accessible on both server and browser
// Without NEXT_PUBLIC_ prefix = server only, undefined in browser
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || "/api/v2";

// 1️) Get signature from backend
import axios from 'axios';

export async function getCloudinarySignature(subfolder = 'uploads'): Promise<CloudinarySignature> {
    const res = await axios.get(`${API_PREFIX}/cloudinary/signature`, {
        params: { subfolder }
    });

    // Assuming the backend returns a structure like { success: true, message: '...', data: { signature, timestamp, apiKey, cloudName, folder } }
    return res.data.data;
}

export async function uploadToCloudinary(file: File, subfolder = 'uploads') {
    try {
        const signatureData = await getCloudinarySignature(subfolder);
        const { signature, timestamp, apiKey, cloudName, folder } = signatureData;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', folder);

        const cloudRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                // Bonus: Upload progress check helper
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    console.log(`Upload progress: ${percentCompleted}%`);
                },
            }
        );

        return cloudRes.data; // Cloudinary response (secure_url, public_id, etc.)
    } catch (error: any) {
        console.error("Axios Upload Error:", error.response?.data || error.message);
        throw new Error('Cloudinary upload failed');
    }
}