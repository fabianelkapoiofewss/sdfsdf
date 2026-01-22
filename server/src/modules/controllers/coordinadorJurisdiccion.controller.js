import { coordinadorJurisdiccionService } from "../services/coordinadorJurisdiccion.service.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const coordinadorJurisdiccionController = {

    obtenerCoordinador: async (req, res, next) => {
        try {
            const { id } = req.params;
            const coordinadorJurisdiccion = await coordinadorJurisdiccionService.obtenerCoordinador(id);
            responseHandler(res, 200, coordinadorJurisdiccion);
        } catch (error) {
            next(error);
        }
    },

    getAllCoordinadoresJurisdiccion: async (req, res, next) => {
        try {
            const coordinadoresJurisdiccion = await coordinadorJurisdiccionService.obtenerCoordinadoresJurisdiccion();
            responseHandler(res, 200, coordinadoresJurisdiccion);
        } catch (error) {
            next(error);
        }
    },

    getAllCoordinadoresByPage: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const coordinadores = await coordinadorJurisdiccionService.getAllCoordinadoresByPage(page);
            responseHandler(res, 200, coordinadores);
        } catch (error) {
            next(error);
        }
    },
    
    getCoordinadorJurisdiccionById: async (req, res, next) => {
        const { id } = req.params;
        try {
            const coordinadorJurisdiccion = await coordinadorJurisdiccionService.obtenerCoordinadorJurisdiccionPorId(id);
            responseHandler(res, 200, coordinadorJurisdiccion);
        } catch (error) {
            next(error);
        }
    },

    crearCoordinadorJurisdiccion: async (req, res, next) => {
        try {
            const coordinadorJurisdiccion = await coordinadorJurisdiccionService.crearCoordinadorJurisdiccion(req.body);
            responseHandler(res, 201, coordinadorJurisdiccion);
        } catch (error) {
            next(error);
        }
    },

    eliminarCoordinadorJurisdiccion: async (req, res, next) => {
        try {
            const { id } = req.params;
            const coordinadorJurisdiccion = await coordinadorJurisdiccionService.eliminarCoordinadorJurisdiccion(id);
            responseHandler(res, 204, 'Coordinador Jurisdiccion Eliminado');
        } catch (error) {
            next(error);
        }
    },

    obtenerCoordinadorConPersonasACargo: async (req, res, next) => {
        try {
            const { dni } = req.params;
            const coordinadorJurisdiccion = await coordinadorJurisdiccionService.obtenerCoordinadorConPersonasACargo(dni);
            responseHandler(res, 200, coordinadorJurisdiccion);
        } catch (error) {
            next(error);
        }
    },

    editarCoordinador: async (req, res, next) => {
        try {
            const { coordinadorId } = req.params;
            const coordinadorActualizado = req.body;

            const coordinadorEditado = await coordinadorJurisdiccionService.actualizarCoordinadorJurisdiccion(coordinadorId, coordinadorActualizado);
            responseHandler(res, 200, coordinadorEditado);

        } catch (error) {
            next(error);
        }
    },
};