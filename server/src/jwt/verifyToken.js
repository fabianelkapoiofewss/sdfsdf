import jwt from "jsonwebtoken";
import { envConfig } from "../config/envConfig.js";

export const verifyToken = async (token) => {
    try {
        const payload = jwt.verify(token, envConfig.JWT_SECRET || '');
        if (!payload.id) {
            throw new Error("Invalid token");
        }
        return payload;
    } catch (error) {
        throw new Error("Invalid token");
    }
};