/**
 * Token Manager
 * Handles storage and retrieval of auth tokens
 * Uses sessionStorage for better security (cleared on browser close)
 */

const TOKEN_KEYS = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
} as const;

class TokenManager {
    /**
     * Get access token
     */
    getAccessToken(): string | null {
        if (typeof window === "undefined") return null; // SSR safety
        return sessionStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    }

    /**
     * Get refresh token
     */
    getRefreshToken(): string | null {
        if (typeof window === "undefined") return null;
        return sessionStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    }

    /**
     * Set tokens
     */
    setTokens(accessToken: string, refreshToken: string): void {
        if (typeof window === "undefined") return;
        sessionStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
        sessionStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    }

    /**
     * Clear tokens
     */
    clearTokens(): void {
        if (typeof window === "undefined") return;
        sessionStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        sessionStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }
}

export const tokenManager = new TokenManager();