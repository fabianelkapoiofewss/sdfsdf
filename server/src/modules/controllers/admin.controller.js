import { adminService } from "../services/admin.service.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const adminController = {
    login: async (req, res, next) => {
        const { identificador, contrasena } = req.body;
        // console.log("Datos recibidos:", { correoElectronico, contrasena });
        try {
            const admin = await adminService.login(identificador, contrasena);
            res.cookie('token', admin.token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            const { token, ...adminData } = admin;
            responseHandler(res, 200, adminData);
        } catch (error) {
            next(error);
        }
    },

    me: async (req, res, next) => {
        try {
            const { id, nombre, apellido, correoElectronico } = req.user;
            responseHandler(res, 200, { id, nombre, apellido, correoElectronico });
        } catch (error) {
            next(error);
        }
    },

    logout: async (req, res, next) => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
            responseHandler(res, 200, { message: 'Sesion cerrada con exito' });
        } catch (error) {
            next(error);
        }
    }
    
};
