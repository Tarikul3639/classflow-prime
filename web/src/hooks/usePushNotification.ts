import { useEffect } from 'react';
import { subscribeToPush } from '@/lib/api/push';

export function usePushNotification(userId: string | null) {
    useEffect(() => {
        if (!userId) return;

        // Register service worker first, then subscribe
        navigator.serviceWorker
            .register('/sw-push.js')
            .then(() => subscribeToPush(userId))
            .catch(console.error);
    }, [userId]);
}