import { accionService } from "../services/accion.service.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const accionController = {
    obtenerAcciones: async (req, res, next) => {
        try {
            const acciones = await accionService.obtenerAcciones();
            responseHandler(res, 200, acciones);
        } catch (error) {
            next(error);
        }
    },

    getAccionById: async (req, res, next) => {
        try {
            const accion = await accionService.obtenerAccionPorId(req.params.id);
            responseHandler(res, 200, accion);
        } catch (error) {
            next(error);
        }
    },

    getAllAccionesByPage: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const acciones = await accionService.getAllAccionesByPage(page);
            responseHandler(res, 200, acciones);
        } catch (error) {
            next(error);
        }
    },

    registrarAccion: async (req, res, next) => {
        try {
            const accion = await accionService.crearAccion(req.body);
            responseHandler(res, 201, accion);
        } catch (error) {
            next(error);
        }
    },

    editarAccion: async (req, res, next) => {
        try {
            const accion = await accionService.editarAccion(req.params.id, req.body);
            responseHandler(res, 200, accion);
        } catch (error) {
            next(error);
        }
    },

    eliminarAccion: async (req, res, next) => {
        try {
            const accion = await accionService.eliminarAccion(req.params.id);
            responseHandler(res, 204, 'Accion Eliminada');
        } catch (error) {
            next(error);
        }
    }
};