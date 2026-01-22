import { envConfig } from "../config/envConfig.js";
import jwt from 'jsonwebtoken';

const secret = envConfig.JWT_SECRET;
const secretOptions = {
    expiresIn: envConfig.JWT_EXPIRES_IN
}

export const createJWT = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, secretOptions, (err, token) => {
            if (err) {
                reject(new Error(`Error al firmar JWT: ${err.message}`));
            } else if (!token) {
                reject(new Error('El token JWT es nulo o está indefinido'));
            } else {
                resolve(token);
            }
        });
    });
}