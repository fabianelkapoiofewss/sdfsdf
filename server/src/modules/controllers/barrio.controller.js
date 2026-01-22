import { barrioService } from "../services/barrio.service.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const barrioController = {

    getAllBarrios: async (req, res, next) => {
        try {
            const barrios = await barrioService.obtenerBarrios();
            responseHandler(res, 200, barrios);
        } catch (error) {
            next(error);
        }
    },

    getBarriosByPage: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const barrios = await barrioService.obtenerBarriosPorPagina(page);
            responseHandler(res, 200, barrios);
        } catch (error) {
            next(error);
        }
    },

    getOneBarrio: async (req, res, next) => {
        try {
            const barrio = await barrioService.obtenerBarrio(req.params.id);
            responseHandler(res, 200, barrio);
        } catch (error) {
            next(error);
        }
    },

    registrarBarrio: async (req, res, next) => {
        try {
            const barrio = await barrioService.registrarBarrio(req.body);
            responseHandler(res, 201, barrio);
        } catch (error) {
            next(error);
        }
    },


    eliminarBarrio: async (req, res, next) => {
        try {
            const { id } = req.params;
            const barrio = await barrioService.eliminarBarrio(id);
            responseHandler(res, 204, 'Barrio Eliminado');
        } catch (error) {
            next(error);
        }
    },

    editarBarrio: async (req, res, next) => {
        try {
            const barrio = await barrioService.editarBarrio(req.params.id, req.body);
            responseHandler(res, 200, barrio);
        } catch (error) {
            next(error);
        }
    }
}