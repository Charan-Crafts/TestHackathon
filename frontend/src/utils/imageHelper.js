// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If it's a relative path starting with /uploads, prepend the backend URL
    if (imagePath.startsWith('/uploads/')) {
        return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
    }

    return imagePath;
}; 