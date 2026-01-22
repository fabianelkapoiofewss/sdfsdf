import { AdminModel } from "../models/admin.js";
import { hash } from "../../utils/hash.js";
import { createJWT } from "../../jwt/createJWT.js";
import { getForId } from "../../utils/getRegisters.js";
import { AppError, mongooseErrorHandler } from "../../utils/handleError.js";


export const adminService = {
    async login(correo, contrasena) {
        try {
            const admin = await AdminModel.findOne({ correoElectronico: correo });
            if (!admin) throw new AppError('Admin no encontrado', 404);

            const passwordValid = await hash.comparePassword(contrasena, admin.contrasena);
            if (!passwordValid) {
                throw new AppError('La Contraseña es incorrecta', 401);
            }

            const token = await createJWT({ id: admin._id, nombre: admin.nombre,
                apellido: admin.apellido,
                correoElectronico: admin.correoElectronico
             });
            return {
                ok: true,
                id: admin._id,
                nombre: admin.nombre,
                apellido: admin.apellido,
                correoElectronico: admin.correoElectronico,
                token: token
            };
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async getAdmin(id) {
        return await getForId(AdminModel, id);
    },

};