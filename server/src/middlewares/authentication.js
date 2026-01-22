import { envConfig } from "../config/envConfig.js";
import { verifyToken } from "../jwt/verifyToken.js";

export const authentication = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }
        const decodedToken = await verifyToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};