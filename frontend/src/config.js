// Configuration for the frontend application
// Uses Vite environment variables if available, otherwise defaults to localhost for dev
// In Docker, you can override this by building with VITE_API_URL or mapping a config.js at runtime.

const config = {
    apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
};

export default config;
