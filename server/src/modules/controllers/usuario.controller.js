import { responseHandler } from "../../utils/responseHandler.js";
import { usuarioService } from "../services/usuario.service.js";


export const usuarioController = {
    registrarUsuario: async (req, res, next) => {
        try {
            const usuario = await usuarioService.registrarUsuario(req.body);
            responseHandler(res, 201, usuario);
        } catch (error) {
            next(error);
        }
    },

    obtenerUsuarios: async (req, res, next) => {
        try {
            const usuarios = await usuarioService.obtenerUsuarios();
            responseHandler(res, 200, usuarios);
        } catch (error) {
            next(error);
        }
    },

    obtenerUsuario: async (req, res, next) => {
        try {
            const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
            responseHandler(res, 200, usuario);
        } catch (error) {
            next(error);
        }
    },

    editarUsuario: async (req, res, next) => {
        try {
            const usuario = await usuarioService.editarUsuario(req.params.id, req.body);
            responseHandler(res, 200, usuario);
        } catch (error) {
            next(error);
        }
    },

    eliminarUsuario: async (req, res, next) => {
        try {
            const usuario = await usuarioService.eliminarUsuario(req.params.id);
            responseHandler(res, 204, 'Usuario Eliminado');
        } catch (error) {
            next(error);
        }
    },
};