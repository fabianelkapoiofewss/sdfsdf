import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from '../config/envConfig.js';
import fs from 'node:fs/promises';
import path from 'node:path';

cloudinary.config({
    cloud_name: envConfig.CLOUD_NAME,
    api_key: envConfig.API_KEY_CLOUD,
    api_secret: envConfig.API_SECRET_CLOUD,
});

export async function subirArchivosCloudinary(files) {
    const uploadedUrls = [];
    for (const file of files) {
        const localPath = file.path;
        // console.log('localPath:', localPath);
        try {
            const result = await cloudinary.uploader.upload(localPath, {
                folder: 'yourtables'
            });
            uploadedUrls.push(result.secure_url);
        } catch (error) {
            console.error(`Error subiendo archivo ${file.filename}:`, error);
            throw new Error('Error al subir archivos a Cloudinary', error);
        } finally {
            // Borra el archivo local después de subirlo
            await fs.unlink(localPath);
        }
    }
    return uploadedUrls;
}