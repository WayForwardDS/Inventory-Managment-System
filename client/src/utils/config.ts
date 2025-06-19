// export const config = {
//   baseUrl: import.meta.env.VITE_BASE_URL,
//   VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
//   VITE_CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY,
//   VITE_CLOUDINARY_API_SECRET: import.meta.env.VITE_CLOUDINARY_API_SECRET,
//   VITE_CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
// }

export const config = {
  baseUrl: import.meta.env.VITE_BASE_URL || 'https://ims-revonspire-1.onrender.com/api/v1',
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || 'your_api_key',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset'
  }
};

// Type safety
export type AppConfig = typeof config;
