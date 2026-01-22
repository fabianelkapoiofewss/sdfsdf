import { usuarioModel } from "../models/usuario.js";
import { create, deleteById, getAll, getForId, updateById } from "../../utils/getRegisters.js";
import { mongooseErrorHandler } from "../../utils/handleError.js";


export const usuarioService = {

    async registrarUsuario(usuario) {
        return await create(usuarioModel, usuario);
    },

    async obtenerUsuarios() {
        try {
            const usuarios = await usuarioModel
                .find({}, '-__v')
                .sort({ _id: -1 })
                .lean()

            return usuarios;
        } catch (error) {
            mongooseErrorHandler(error)
        }
    },

    async obtenerUsuarioPorId(id) {
        return await getForId(usuarioModel, id);
    },

    async editarUsuario(id, usuario) {
        return await updateById(usuarioModel, id, usuario);
    },

    async eliminarUsuario(id) {
        return await deleteById(usuarioModel, id);
    },

}