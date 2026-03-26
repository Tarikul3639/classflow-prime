import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/api/cloudinary';

export const useFileUpload = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const upload = async (file: File, subfolder?: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await uploadToCloudinary(file, subfolder);
            return data;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { upload, loading, error };
};