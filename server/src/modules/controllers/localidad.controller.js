import { localidadService } from "../services/localidad.service.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const localidadController = {
    getAllLocalidades: async (req, res, next) => {
        try {
            const localidades = await localidadService.getAllLocalidades();
            responseHandler(res, 200, localidades);
        } catch (error) {
            next(error);
        }
    },

    obtenerLocalidad: async (req, res, next) => {
        try {
            const localidad = await localidadService.obtenerLocalidad(req.params.id);
            responseHandler(res, 200, localidad);
        } catch (error) {
            next(error);
        }
    },

    getLocalidadesByPage: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const localidades = await localidadService.getLocalidadesPorPagina(page);
            responseHandler(res, 200, localidades);
        } catch (error) {
            next(error);
        }
    },


    crearLocalidad: async (req, res, next) => {
        try {
            const localidad = await localidadService.crearLocalidad(req.body);
            responseHandler(res, 201, localidad);
        } catch (error) {
            next(error);
        }
    },

    eliminarLocalidad: async (req, res, next) => {
        try {
            const { id } = req.params;
            const localidad = await localidadService.eliminarLocalidad(id);
            responseHandler(res, 204, 'Localidad Eliminada');
        } catch (error) {
            next(error);
        }
    },

    editarLocalidad: async (req, res, next) => {
        try {
            const localidad = await localidadService.actualizarLocalidad(req.params.id, req.body);
            responseHandler(res, 200, localidad);
        } catch (error) {
            next(error);
        }
    }
};