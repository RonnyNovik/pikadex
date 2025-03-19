interface FetchOptions extends RequestInit {
    token: string | null;
}

/**
 * Utility function for making authenticated API requests
 * @template T - The expected return type of the API response
 * @param {string} endpoint - The API endpoint to fetch from
 * @param {FetchOptions} [options] - Request options including authentication token
 * @param {string | null} [options.token] - JWT auth token
 * @returns {Promise<T>} Promise that resolves with the JSON response data
 * @throws {Error} Throws if the network request fails or returns non-200 status
 */
export async function fetchUtil<T>(endpoint: string, options: FetchOptions = {
    token: null
}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers = new Headers(options.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
            ...fetchOptions,
            headers,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('Network error: Please check your connection');
        }
        throw error;
    }
} 