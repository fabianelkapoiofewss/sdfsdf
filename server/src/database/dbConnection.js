import mongoose from 'mongoose';
import { envConfig } from '../config/envConfig.js';

export async function dbConnect() {

    const dbUrl = envConfig.NODE_ENV === 'production'
        ? envConfig.MONGO_URL
        : envConfig.DATABASE_TEST;

    try {
        await mongoose.connect(dbUrl);
        console.log(`Conectado a la base de datos (${envConfig.NODE_ENV})`);
    } catch (error) {
        console.error("Error de conexión a la base de datos:", error.message);
        throw new Error(error);
    }
};