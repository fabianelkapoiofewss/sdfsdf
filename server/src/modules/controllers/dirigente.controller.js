import { dirigenteService } from "../services/dirigente.service.js";
import { responseHandler } from "../../utils/responseHandler.js";


export const dirigenteController = {
    crearDirigente: async (req, res, next) => {
        try {
            const dirigente = await dirigenteService.crearDirigente(req.body);
            responseHandler(res, 201, dirigente);
        } catch (error) {
            next(error);
        }
    },

    getAllDirigentes: async (req, res, next) => {
        try {
            const dirigentes = await dirigenteService.obtenerDirigentes();
            responseHandler(res, 200, dirigentes);
        } catch (error) {
            next(error);
        }
    },
    
    getAllDirigentesByPage: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const dirigentes = await dirigenteService.getAllDirigentesByPage(page);
            responseHandler(res, 200, dirigentes);
        } catch (error) {
            next(error);
        }
    },


    getDirigenteById: async (req, res, next) => {
        const { id } = req.params;
        try {
            const dirigente = await dirigenteService.obtenerDirigentePorId(id);
            responseHandler(res, 200, dirigente);
        } catch (error) {
            next(error);
        }
    },


    actualizarDirigente: async (req, res, next) => {
        const { id } = req.params;
        const dirigente = req.body;
        try {
            const dirigenteActualizado = await dirigenteService.actualizarDirigente(id, dirigente);
            responseHandler(res, 200, dirigenteActualizado);
        } catch (error) {
            next(error);
        }
    },

    eliminarDirigente: async (req, res, next) => {
        try {
            const { id } = req.params;
            const dirigente = await dirigenteService.eliminarDirigente(id);
            responseHandler(res, 204, 'Dirigente Eliminado');
        } catch (error) {
            next(error);
        }
    }

};