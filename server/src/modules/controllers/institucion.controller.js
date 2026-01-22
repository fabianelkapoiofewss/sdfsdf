import { institucionService } from "../services/institucion.service.js";
import { responseHandler } from "../../utils/responseHandler.js";

export const institucionController = {
    registrarInstitucion: async (req, res, next) => {
        try {
            const institucion = req.body;
            const institucionCreada = await institucionService.registrarInstitucion(institucion);
            responseHandler(res, 201, institucionCreada);
        } catch (error) {
            next(error);
        }
    },

    obtenerInstituciones: async (req, res, next) => {
        try {
            const instituciones = await institucionService.obtenerInstituciones();
            responseHandler(res, 200, instituciones);
        } catch (error) {
            next(error);
        }
    },

    getAllInstitucionesByPage: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const instituciones = await institucionService.getAllInstitucionesByPage(page);
            responseHandler(res, 200, instituciones);
        } catch (error) {
            next(error);
        }
    },

    buscarInstituciones: async (req, res, next) => {
        try {
            const { nombre } = req.query; // Capturamos el parámetro de búsqueda
            if (!nombre) {
                return responseHandler(res, 400, { mensaje: "El parámetro 'nombre' es requerido" });
            }
            const instituciones = await institucionService.buscarInstituciones(nombre);
            responseHandler(res, 200, instituciones);
        } catch (error) {
            next(error);
        }
    },

    editarInstitucion: async (req, res, next) => {
        try {
            const { id } = req.params;
            const institucion = req.body;
            const institucionEditada = await institucionService.editarInstitucion(id, institucion);
            responseHandler(res, 200, institucionEditada);
        } catch (error) {
            next(error);
        }
    },

    eliminarInstitucion: async (req, res, next) => {
        try {
            const { id } = req.params;
            await institucionService.eliminarInstitucion(id);
            responseHandler(res, 204, 'Institución Eliminada');
        } catch (error) {
            next(error);
        }
    },

    obtenerInstitucionPorNombre: async (req, res, next) => {
        try {
            const { nombreInstitucion } = req.params;
            const institucion = await institucionService.obtenerInstitucionPorNombre(nombreInstitucion);
            responseHandler(res, 200, institucion);
        } catch (error) {
            next(error);
        }
    },

    obtenerInstitucionPorId: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                responseHandler(res, 400, { mensaje: "El parámetro 'id' es requerido" });
            }
            const institucion = await institucionService.obtenerInstitucionPorId(id);
            responseHandler(res, 200, institucion);
        } catch (error) {
            next(error);
        }
    }
};