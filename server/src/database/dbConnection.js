import mongoose from 'mongoose';
import { envConfig } from '../config/envConfig.js';

export async function dbConnect() {

    console.log("NODE_ENV:", envConfig.NODE_ENV);
console.log("MONGO_URL:", envConfig.MONGO_URL ? "OK" : "UNDEFINED");

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
