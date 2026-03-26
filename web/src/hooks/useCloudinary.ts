import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/api/cloudinary';

export const useFileUpload = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Upload a file to Cloudinary
     * @param file File object
     * @param subfolder Cloudinary folder (default: 'uploads')
     * @returns Cloudinary response (secure_url, public_id, etc.)
     */
    // useCloudinary.ts
    const upload = async (file: File, subfolder = "uploads") => {
        setLoading(true);
        setError(null);

        try {
            // ✅ PDF must be "raw" so the URL is directly accessible
            const resourceType: "auto" | "image" | "raw" =
                file.type === "application/pdf"
                    ? "raw"
                    : file.type.startsWith("image/")
                        ? "image"
                        : "auto";

            const data = await uploadToCloudinary(file, subfolder, resourceType);
            return data;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { upload, loading, error };
};