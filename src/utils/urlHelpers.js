
export const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/600?text=No+Image';

    // Handle local file system paths from products.js (legacy seed data)
    if (imagePath.includes('Mitreyi Images') || imagePath.includes('../data/')) {
        const fileName = imagePath.split('/').pop();
        imagePath = `/uploads/product/${fileName}`;
    }

    // Fix for legacy localhost URLs in stored data
    // If we're in dev mode, we want to respect the current port, not what's stored in DB (e.g. :8000 vs :4000)
    if (imagePath.includes('localhost')) {
        try {
            // If it is a full URL, strip the domain and keep the path
            // This converts http://localhost:XYZ/uploads/foo.jpg -> /uploads/foo.jpg
            const url = new URL(imagePath);
            imagePath = url.pathname;
        } catch (e) {
            // Not a valid URL, treat as relative path
        }
    }

    // If it's an external URL (http/https but NOT localhost), return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // Ensure leading slash
    if (!imagePath.startsWith('/')) {
        imagePath = `/${imagePath}`;
    }

    // Base URL from environment
    let BASE_URL = import.meta.env.VITE_API_URL || '';

    // If the base URL includes /api/v1 (or similar), we strip it for static assets
    // because products are served from /uploads, not from /api/v1/uploads
    if (BASE_URL.includes('/api/v1')) {
        BASE_URL = BASE_URL.split('/api/v1')[0];
    }

    // Remove trailing slash from BASE_URL if present, and leading slash from imagePath
    // to avoid double slashes like domain.com//uploads
    const cleanBase = BASE_URL.replace(/\/+$/, '');
    const cleanPath = imagePath.replace(/^\/+/, '');

    return `${cleanBase}/${cleanPath}`;
};
