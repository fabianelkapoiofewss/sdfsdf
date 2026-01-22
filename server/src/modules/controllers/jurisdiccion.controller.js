import { jurisdiccionService } from "../services/jurisdiccion.service.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const jurisdiccionController = {
    getAllJurisdicciones: async (req, res, next) => {
        try {
            const jurisdicciones = await jurisdiccionService.getJurisdicciones();
            responseHandler(res, 200, jurisdicciones);
        } catch (error) {
            next(error);
        }
    },

    getAllJurisdiccionesByPage: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const jurisdicciones = await jurisdiccionService.getAllJurisdiccionesByPage(page);
            responseHandler(res, 200, jurisdicciones);
        } catch (error) {
            next(error)
        }
    },

    obtenerJurisdiccionPorId: async (req, res, next) => {
        try {
            const { id } = req.params;
            const jurisdiccion = await jurisdiccionService.obtenerJurisdiccion(id);
            responseHandler(res, 200, jurisdiccion);
        } catch (error) {
            next(error)
        }
    },

    registrarJurisdiccion: async (req, res, next) => {
        try {
            const jurisdiccion = await jurisdiccionService.crearJurisdiccion(req.body);
            responseHandler(res, 201, jurisdiccion);
        } catch (error) {
            next(error);
        }
    },

    editarJurisdiccion: async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;
            const jurisdiccionActualizada = await jurisdiccionService.editarJurisdiccion(id, body)
            responseHandler(res, 200, jurisdiccionActualizada);
        } catch (error) {
            console.log('Error al intentar actualizar Jurisdiccion', error)
            next(error)
        }
    },

    eliminarJurisdiccion: async (req, res, next) => {
        try {
            const { id } = req.params;
            const jurisdiccionEliminada = await jurisdiccionService.eliminarJurisdiccion(id);
            responseHandler(res, 204, 'Jurisdiccion Eliminada');
        } catch (error) {
            next(error);
        }
    }
};